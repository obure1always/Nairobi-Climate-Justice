import request from 'supertest';
import app, { startServer } from '../src/index';
import { 
  setupDb, 
  User, 
  UserSession, 
  ModuleProgress, 
  LessonProgress,
  Certificate,
  ProjectSubmission,
  ImpactAction 
} from '../src/models/index';
import { createSession } from '../src/services/authService';

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
    it('requests OTP and verifies phone number', async () => {
      const sendRes = await request(app)
        .post('/api/v1/auth/phone/send-otp')
        .send({ countryCode: '+254', nationalNumber: '0711223344' });

      expect(sendRes.status).toBe(200);
      expect(sendRes.body.success).toBe(true);
      const otp = sendRes.body.devOtp;

      const verifyRes = await request(app)
        .post('/api/v1/auth/phone/verify')
        .send({ countryCode: '+254', nationalNumber: '0711223344', code: otp, displayName: 'Kevin Omondi' });

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.success).toBe(true);
      expect(verifyRes.body.token).toBeDefined();
      expect(verifyRes.body.user.phone).toBe('+254711223344');
    });

    it('rejects invalid OTP attempts', async () => {
      const verifyRes = await request(app)
        .post('/api/v1/auth/phone/verify')
        .send({ countryCode: '+254', nationalNumber: '0711223344', code: '000000' });

      expect(verifyRes.status).toBe(400);
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
    it('records quiz submission and validates passing threshold of 70%', async () => {
      const passRes = await request(app)
        .post('/api/v1/assessments/submit')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          moduleId: 'm1',
          pathwayId: 'path-science',
          score: 4,
          totalQuestions: 5,
          answers: { q1: 1, q2: 0, q3: 2, q4: 3, q5: 1 },
          feedback: ['Correct explanation for Q1']
        });

      expect(passRes.status).toBe(201);
      expect(passRes.body.passed).toBe(true);
      expect(passRes.body.percentage).toBe(80);
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

    it('issues digital certificate upon fulfilling requirements and prevents duplicates', async () => {
      // Ensure module progress exists
      await ModuleProgress.findOrCreate({
        where: { userId: learnerId, moduleId: 'm1' },
        defaults: {
          userId: learnerId,
          participantId: `USER-${learnerId.substring(0, 8)}`,
          moduleId: 'm1',
          completedLessons: 4,
          completed: true,
          lastAccessed: new Date()
        }
      });

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
      expect(issueRes.body.certificate.id).toMatch(/^CJN-2026-[A-F0-9]+$/);
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
    });

    it('publicly verifies certificate without authentication', async () => {
      const verifyRes = await request(app)
        .get(`/api/v1/certificates/verify/${issuedCertId}`);

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.verified).toBe(true);
      expect(verifyRes.body.learnerName).toBe('Amina Wanjiku');
      expect(verifyRes.body.issuingOrganization).toContain('Climate Justice Nairobi');
    });

    it('returns 404 for nonexistent certificate verification', async () => {
      const verifyRes = await request(app)
        .get('/api/v1/certificates/verify/CJN-FAKE-999');

      expect(verifyRes.status).toBe(404);
      expect(verifyRes.body.verified).toBe(false);
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
