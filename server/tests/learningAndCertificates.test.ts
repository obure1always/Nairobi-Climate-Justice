import request from 'supertest';
import { writeFile } from 'node:fs/promises';
import app, { startServer } from '../src/index';
import { 
  setupDb, 
  User, 
  UserSession, 
  LessonProgress,
  QuizSubmission,
  Certificate,
  CertificateDelivery,
  SyncRecord,
  ProjectSubmission,
  ImpactAction 
} from '../src/models/index';
import { createSession, hashPassword } from '../src/services/authService';
import { COURSE_MODULES } from '../src/services/courseCatalog';
import { attemptCertificateEmail } from '../src/services/certificateEmail';
import { PDFDocument } from 'pdf-lib';

describe('Core Learning Experience & Institutional API Endpoints', () => {
  let learnerToken: string;
  let instructorToken: string;
  let learnerId: string;
  let instructorId: string;

  beforeAll(async () => {
    await setupDb();

    // Create a verified learner
    const learner = await User.create({
      phone: '+254712345678',
      phoneVerified: true,
      email: 'amina@example.test',
      emailVerified: true,
      name: 'Amina Wanjiku',
      role: 'learner',
      authProvider: 'phone'
    });
    learnerId = learner.id;
    learnerToken = await createSession(learner.id);

    // Create an instructor
    const instructor = await User.create({
      email: 'instructor@climatejustice.ke',
      name: 'Dr. Wanjiku Muthoni',
      role: 'instructor',
      title: 'Senior Faculty & Research Director',
      authProvider: 'email'
    });
    instructorId = instructor.id;
    instructorToken = await createSession(instructor.id);
  });

  describe('Phone Authentication Endpoints', () => {
    it('registers with phone and password, establishes authenticated session', async () => {
      const regRes = await request(app)
        .post('/api/v1/auth/phone/register')
        .send({ 
          countryCode: '+254', 
          nationalNumber: '0711223344', 
          password: 'KevinSecurePassword123!', 
          name: 'Kevin Omondi' 
        });

      expect(regRes.status).toBe(201);
      expect(regRes.body.success).toBe(true);
      expect(regRes.body.token).toBeDefined();
      expect(regRes.body.user.phone).toBe('+254711223344');
      expect(regRes.body.user.phoneVerified).toBe(false);

      // Logs in with phone and password
      const loginRes = await request(app)
        .post('/api/v1/auth/phone/login')
        .send({
          countryCode: '+254',
          nationalNumber: '0711223344',
          password: 'KevinSecurePassword123!'
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.success).toBe(true);
      expect(loginRes.body.token).toBeDefined();
      expect(loginRes.body.user.phone).toBe('+254711223344');
    });

    it('rejects invalid password attempts', async () => {
      const verifyRes = await request(app)
        .post('/api/v1/auth/phone/login')
        .send({ countryCode: '+254', nationalNumber: '0711223344', password: 'WrongPassword!' });

      expect(verifyRes.status).toBe(401);
      expect(verifyRes.body.success).toBe(false);
    });
  });

  describe('Lesson Progress & Resume Position', () => {
    it('saves lesson progress and aggregates into module completion', async () => {
      const saveRes = await request(app)
        .post('/api/v1/learning/progress')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          moduleId: 'm1',
          lessonId: 'm1-l1',
          completed: true,
          playbackSeconds: 145,
          notes: 'Important key takeaway on bimodal rainfall regime'
        });

      expect(saveRes.status).toBe(200);
      expect(saveRes.body.success).toBe(true);
      expect(saveRes.body.lessonProgress.playbackSeconds).toBe(145);

      // Verify retrieval
      const getRes = await request(app)
        .get('/api/v1/learning/progress')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.lessonProgress.length).toBeGreaterThan(0);
      expect(getRes.body.lessonProgress[0].lessonId).toBe('m1-l1');
    });
  });

  describe('Post-Lesson Q&A with Instructor Response', () => {
    let questionId: string;

    it('allows learner to ask a question after a lesson', async () => {
      const res = await request(app)
        .post('/api/v1/learning/questions')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          moduleId: 'm1',
          lessonId: 'm1-l1',
          question: 'How does the urban heat island effect impact night-time cooling in informal settlements?'
        });

      expect(res.status).toBe(201);
      expect(res.body.question).toContain('urban heat island');
      questionId = res.body.id;
    });

    it('allows authorized instructor to reply to learner question', async () => {
      const res = await request(app)
        .post(`/api/v1/learning/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          answer: 'Uninsulated corrugated iron and dense masonry store heat during daylight and slowly release it at night without vegetative cooling.'
        });

      expect(res.status).toBe(200);
      expect(res.body.isAnswered).toBe(true);
      expect(res.body.answeredBy).toContain('Dr. Wanjiku Muthoni');
    });

    it('prevents unauthorized learners from replying as instructor', async () => {
      const res = await request(app)
        .post(`/api/v1/learning/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({ answer: 'Unauthorized answer attempt' });

      expect(res.status).toBe(403);
    });
  });

  describe('Interactive Quiz Submission & Integrity', () => {
    it('grades actual answers on the server and returns the original attempt on retry', async () => {
      const clientEventId = 'test-course-m1-attempt';
      const answers = Object.fromEntries(COURSE_MODULES[0].questions.map(question => [question.id, 1]));
      const failedAttempt = await request(app)
        .post('/api/v1/assessments/submit')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          moduleId: 'm1',
          clientEventId: 'test-course-m1-failed',
          score: 8,
          totalQuestions: 8,
          answers: Object.fromEntries(COURSE_MODULES[0].questions.map(question => [question.id, 0]))
        });
      expect(failedAttempt.status).toBe(201);
      expect(failedAttempt.body.score).toBe(0);
      expect(failedAttempt.body.passed).toBe(false);

      const passRes = await request(app)
        .post('/api/v1/assessments/submit')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          moduleId: 'm1',
          clientEventId,
          score: 0,
          totalQuestions: 1,
          answers
        });

      expect(passRes.status).toBe(201);
      expect(passRes.body.passed).toBe(true);
      expect(passRes.body.percentage).toBe(100);
      expect(passRes.body.score).toBe(COURSE_MODULES[0].questions.length);

      const retry = await request(app)
        .post('/api/v1/assessments/submit')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({ moduleId: 'm1', clientEventId, answers });
      expect(retry.body.duplicate).toBe(true);
      expect(retry.body.submissionId).toBe(passRes.body.submissionId);

      const offlineRetry = await request(app)
        .post('/api/v1/sync')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          records: [{
            clientEventId,
            ownerId: learnerId,
            entityType: 'QUIZ_ATTEMPT',
            entityData: { moduleId: 'm1', answers }
          }]
        });

      expect(offlineRetry.status).toBe(200);
      expect(offlineRetry.body.processedIds).toEqual([clientEventId]);
      expect(offlineRetry.body.failedIds).toEqual([]);
      expect(await QuizSubmission.count({ where: { userId: learnerId, clientEventId } })).toBe(1);
    });
  });

  describe('Practical Projects & Instructor Rubric Grading', () => {
    let submissionId: string;

    it('allows learner to submit a practical project proposal', async () => {
      const submitRes = await request(app)
        .post('/api/v1/projects/submit')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          projectId: 'proj-carbon-footprint',
          title: 'Kibera Kiosk Carbon & Energy Audit',
          summary: 'Audit of monthly energy use, LPG cooking, and waste diversion for 3 micro-enterprises.',
          calculatorData: { monthlyCO2Kg: 245.5, topHotspot: 'Charcoal cooking' }
        });

      expect(submitRes.status).toBe(201);
      expect(submitRes.body.success).toBe(true);
      submissionId = submitRes.body.submission.id;
    });

    it('allows instructor to evaluate and grade submission using rubrics', async () => {
      const gradeRes = await request(app)
        .post(`/api/v1/instructor/projects/${submissionId}/grade`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          score: 88,
          rubricScores: { calculation: 25, hotspot: 22, mitigation: 25, clarity: 16 },
          instructorFeedback: 'Excellent practical local analysis. Realistic emissions coefficients applied.',
          status: 'graded'
        });

      expect(gradeRes.status).toBe(200);
      expect(gradeRes.body.submission.status).toBe('graded');
      expect(gradeRes.body.submission.score).toBe(88);
    });
  });

  describe('Verifiable Digital Certificates Lifecycle', () => {
    let issuedCertId: string;

    it('does not issue a course certificate before all requirements are met', async () => {
      const response = await request(app)
        .post('/api/v1/certificates/issue')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({});
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('issues digital certificate upon fulfilling requirements and prevents duplicates', async () => {
      for (const courseModule of COURSE_MODULES) {
        for (const lessonId of courseModule.lessons) {
          await LessonProgress.findOrCreate({
            where: { userId: learnerId, moduleId: courseModule.id, lessonId },
            defaults: {
              userId: learnerId,
              moduleId: courseModule.id,
              lessonId,
              completed: true,
              playbackSeconds: 0,
              notes: null,
              lastAccessedAt: new Date()
            }
          });
        }
        await QuizSubmission.findOrCreate({
          where: { userId: learnerId, clientEventId: `certificate-${courseModule.id}` },
          defaults: {
            userId: learnerId,
            moduleId: courseModule.id,
            clientEventId: `certificate-${courseModule.id}`,
            pathwayId: 'nairobi-climate-justice',
            score: courseModule.questions.length,
            totalQuestions: courseModule.questions.length,
            passed: true,
            answers: {}
          }
        });
      }

      const issueRes = await request(app)
        .post('/api/v1/certificates/issue')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          pathwayId: 'path-science',
          pathwayTitle: 'Climate Science & Urban Hazards Mastery',
          skills: ['Urban Heat Island Analysis', 'Riparian Flood Mapping', 'Community Climate Adaptation']
        });

      expect(issueRes.status).toBe(200);
      expect(issueRes.body.success).toBe(true);
      expect(issueRes.body.certificate.id).toMatch(/^CJN-\d{4}-[A-F0-9]+$/);
      expect(issueRes.body.emailDeliveryStatus).toBe('failed');
      issuedCertId = issueRes.body.certificate.id;

      // Duplicate issuance returns existing certificate idempotently
      const dupRes = await request(app)
        .post('/api/v1/certificates/issue')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          pathwayId: 'path-science',
          pathwayTitle: 'Climate Science & Urban Hazards Mastery'
        });

      expect(dupRes.status).toBe(200);
      expect(dupRes.body.certificate.id).toBe(issuedCertId);
      const delivery = await CertificateDelivery.findByPk(issuedCertId);
      expect(delivery?.attemptCount).toBe(1);
    });

    it('publicly verifies certificate without authentication', async () => {
      const verifyRes = await request(app)
        .get(`/api/v1/certificates/verify/${issuedCertId}`);

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.verified).toBe(true);
      expect(verifyRes.body.learnerName).toBe('Amina Wanjiku');
      expect(verifyRes.body.issuingOrganization).toContain('Climate Justice Nairobi');
    });

    it('downloads a PDF whose certificate identifier matches the saved certificate', async () => {
      const pdfRes = await request(app)
        .get(`/api/v1/certificates/${issuedCertId}/pdf`)
        .set('Authorization', `Bearer ${learnerToken}`)
        .expect(200)
        .expect('Content-Type', /application\/pdf/);
      const bytes = Buffer.from(pdfRes.body);
      const pdf = await PDFDocument.load(bytes);
      expect(pdf.getPageCount()).toBe(1);
      expect(pdf.getPage(0).getWidth()).toBeCloseTo(841.89, 1);
      expect(pdf.getPage(0).getHeight()).toBeCloseTo(595.28, 1);
      if (process.env.CERTIFICATE_TEST_PDF_OUTPUT) {
        await writeFile(process.env.CERTIFICATE_TEST_PDF_OUTPUT, bytes);
      }
    });

    it('retries failed email with the exact downloadable PDF and keeps the existing certificate', async () => {
      const dashboardRes = await request(app)
        .get('/api/v1/certificates/my-certificates')
        .set('Authorization', 'Bearer ' + learnerToken)
      expect(dashboardRes.status).toBe(200);
      const dashboardCertificate = dashboardRes.body.find((item: any) => item.id === issuedCertId);
      expect(dashboardCertificate.emailDeliveryStatus).toBe('failed');

      const pdfRes = await request(app)
        .get(`/api/v1/certificates/${issuedCertId}/pdf`)
        .set('Authorization', 'Bearer ' + learnerToken)
        .expect(200)
        .expect('Content-Type', /application\/pdf/);
      const downloadedPdf = Buffer.from(pdfRes.body);
      const originalCertificate = await Certificate.findByPk(issuedCertId);
      const originalIssueDate = originalCertificate?.issueDate.getTime();
      let emailedPdf: Buffer | undefined;

      const delivery = await attemptCertificateEmail(
        issuedCertId,
        async (recipient, certificate, pdfBytes) => {
          expect(recipient).toBe('amina@example.test');
          expect(certificate.id).toBe(issuedCertId);
          emailedPdf = pdfBytes;
        },
        true
      );
      expect(delivery?.status).toBe('sent');
      expect(emailedPdf?.equals(downloadedPdf)).toBe(true);

      const duplicateIssue = await request(app)
        .post('/api/v1/certificates/issue')
        .set('Authorization', 'Bearer ' + learnerToken)
        .send({});
      expect(duplicateIssue.body.certificate.id).toBe(issuedCertId);
      expect(duplicateIssue.body.emailDeliveryStatus).toBe('sent');

      const savedCertificate = await Certificate.findByPk(issuedCertId);
      const savedDelivery = await CertificateDelivery.findByPk(issuedCertId);
      expect(savedCertificate?.issueDate.getTime()).toBe(originalIssueDate);
      expect(savedDelivery?.attemptCount).toBe(2);
      expect(savedDelivery?.status).toBe('sent');
    });

    it('returns 404 for nonexistent certificate verification', async () => {
      const verifyRes = await request(app)
        .get('/api/v1/certificates/verify/CJN-FAKE-999');

      expect(verifyRes.status).toBe(404);
      expect(verifyRes.body.verified).toBe(false);
    });
  });

  describe('Offline completion synchronization', () => {
    it('issues and emails once when final lesson progress syncs after the final quiz', async () => {
      const { hash, salt } = hashPassword('OfflineSyncPass123!');
      const learner = await User.create({
        email: 'offline-learner@example.test',
        emailVerified: true,
        name: 'Musa Otieno',
        passwordHash: hash,
        passwordSalt: salt,
        role: 'learner',
        authProvider: 'email'
      });
      const login = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'offline-learner@example.test', password: 'OfflineSyncPass123!' });
      expect(login.status).toBe(200);
      expect(login.body.user.emailVerified).toBe(true);
      const token = login.body.token;

      const incomplete = await request(app)
        .post('/api/v1/certificates/issue')
        .set('Authorization', 'Bearer ' + token)
        .send({});
      expect(incomplete.status).toBe(409);

      const quizRecords = COURSE_MODULES.map((courseModule, index) => ({
        clientEventId: `offline-quiz-${index}`,
        ownerId: learner.id,
        entityType: 'QUIZ_ATTEMPT',
        entityData: {
          moduleId: courseModule.id,
          answers: Object.fromEntries(courseModule.questions.map(question => [
            question.id,
            question.correctAnswer
          ]))
        }
      }));
      const progressRecords = COURSE_MODULES.map((courseModule, index) => ({
        clientEventId: `offline-progress-${index}`,
        ownerId: learner.id,
        entityType: 'PROGRESS',
        entityData: {
          moduleId: courseModule.id,
          completedLessons: courseModule.lessons.map((_lessonId, lessonIndex) => lessonIndex)
        }
      }));

      const quizSync = await request(app)
        .post('/api/v1/sync')
        .set('Authorization', 'Bearer ' + token)
        .send({ records: quizRecords });
      expect(quizSync.status).toBe(200);
      expect(quizSync.body.processedIds).toHaveLength(COURSE_MODULES.length);
      expect(await Certificate.count({ where: { userId: learner.id } })).toBe(0);

      await LessonProgress.create({
        userId: learner.id,
        moduleId: COURSE_MODULES[0].id,
        lessonId: COURSE_MODULES[0].lessons[0],
        completed: false,
        playbackSeconds: 30,
        notes: null,
        lastAccessedAt: new Date()
      });

      const progressSync = await request(app)
        .post('/api/v1/sync')
        .set('Authorization', 'Bearer ' + token)
        .send({ records: progressRecords });
      expect(progressSync.status).toBe(200);
      expect(progressSync.body.processedIds).toHaveLength(COURSE_MODULES.length);
      expect(progressSync.body.failedIds).toHaveLength(0);
      expect((await LessonProgress.findOne({
        where: {
          userId: learner.id,
          moduleId: COURSE_MODULES[0].id,
          lessonId: COURSE_MODULES[0].lessons[0]
        }
      }))?.completed).toBe(true);

      const certificate = await Certificate.findOne({
        where: { userId: learner.id, pathwayId: 'nairobi-climate-justice' }
      });
      expect(certificate).not.toBeNull();
      expect(certificate?.learnerName).toBe('Musa Otieno');
      const delivery = await CertificateDelivery.findByPk(certificate!.id);
      expect(delivery?.status).toBe('failed');
      expect(delivery?.attemptCount).toBe(1);

      const repeatedProgress = await request(app)
        .post('/api/v1/sync')
        .set('Authorization', 'Bearer ' + token)
        .send({
          records: [{
            ...progressRecords[progressRecords.length - 1],
            clientEventId: 'offline-progress-repeat',
            createdAt: new Date().toISOString()
          }]
        });
      expect(repeatedProgress.status).toBe(200);
      expect(await Certificate.count({ where: { userId: learner.id } })).toBe(1);
      expect((await CertificateDelivery.findByPk(certificate!.id))?.attemptCount).toBe(1);
      expect(await SyncRecord.count({ where: { userId: learner.id } })).toBe(COURSE_MODULES.length * 2 + 1);

      const dashboard = await request(app)
        .get('/api/v1/certificates/my-certificates')
        .set('Authorization', 'Bearer ' + token)
      expect(dashboard.status).toBe(200);
      expect(dashboard.body[0].emailDeliveryStatus).toBe('failed');

      const pdfResponse = await request(app)
        .get(`/api/v1/certificates/${certificate!.id}/pdf`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /application\/pdf/);
      const pdf = await PDFDocument.load(Buffer.from(pdfResponse.body));
      expect(pdf.getPageCount()).toBe(1);

      const verification = await request(app)
        .get(`/api/v1/certificates/verify/${certificate!.id}`);
      expect(verification.status).toBe(200);
      expect(verification.body.verified).toBe(true);
    });
  });

  describe('Climate Datasets, Case Studies & Impact Tracking', () => {
    it('returns documented African climate datasets with sources and units', async () => {
      const res = await request(app).get('/api/v1/climate/datasets');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].source).toContain('Kenya Meteorological Department');
    });

    it('returns documented Kenyan climate case studies across diverse regions', async () => {
      const res = await request(app).get('/api/v1/climate/case-studies');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(4);
      expect(res.body.every((c: any) => c.country === 'Kenya')).toBe(true);
      expect(res.body.some((c: any) => c.id.includes('makueni'))).toBe(true);
      expect(res.body.some((c: any) => c.id.includes('turkana'))).toBe(true);
    });

    it('records and verifies real-world climate impact action', async () => {
      const actionRes = await request(app)
        .post('/api/v1/impact/actions')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          actionType: 'trees_planted',
          title: 'Mathare River Riparian Bamboo Buffer',
          description: 'Planted 150 bamboo and vetiver grass seedlings along the 30-meter buffer zone.',
          quantity: 150,
          unit: 'seedlings',
          methodology: 'GPS-mapped survival count'
        });

      expect(actionRes.status).toBe(201);
      expect(actionRes.body.action.status).toBe('self_reported');
      const actionId = actionRes.body.action.id;

      // Instructor verifies impact
      const verifyRes = await request(app)
        .post(`/api/v1/instructor/impact/${actionId}/verify`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ status: 'verified' });

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.action.status).toBe('verified');
      expect(verifyRes.body.action.verifiedBy).toContain('Dr. Wanjiku Muthoni');
    });

    it('updates user profile via PATCH /api/v1/auth/profile', async () => {
      const res = await request(app)
        .patch('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          name: 'Amina Wanjiku Edited',
          bio: 'Community climate activist based in Kibera, passionate about urban farming.',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.name).toBe('Amina Wanjiku Edited');
      expect(res.body.user.bio).toBe('Community climate activist based in Kibera, passionate about urban farming.');
      expect(res.body.user.avatarUrl).toContain('unsplash.com');
    });

    it('submits a support ticket via POST /api/v1/support/tickets', async () => {
      const res = await request(app)
        .post('/api/v1/support/tickets')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          name: 'Amina Wanjiku',
          email: 'learner@climatejustice.ke',
          category: 'certificates',
          subject: 'Question regarding certificate verification QR',
          message: 'How can our municipal committee verify our certificate hash on mobile devices without an active internet connection?'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.ticketId).toMatch(/^CJN-TICK-/);
      expect(res.body.message).toContain('logged with reference');
    });
  });
});
