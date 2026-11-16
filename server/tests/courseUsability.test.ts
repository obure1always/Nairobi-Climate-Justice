import request from 'supertest';
import app from '../src/index';
import { Certificate, CourseUsabilityResponse, LessonProgress, QuizSubmission, setupDb, User } from '../src/models/index';
import { createSession } from '../src/services/authService';
import { COURSE_MODULES } from '../src/services/courseCatalog';

const surveyEndpoint = '/api/v1/assessments/sus';
const exportEndpoint = '/api/v1/admin/export/sus';
const workbookEndpoint = '/api/v1/admin/export/sus.xlsx';
const answers = [4, 2, 4, 2, 4, 2, 4, 2, 4, 2];
const submission = { answers, language: 'sw', comment: '  Mafunzo yalikuwa wazi.  ' };

describe('Course usability survey', () => {
  let learnerId: string;
  let learnerAuth: string;
  let otherLearnerAuth: string;
  let adminAuth: string;

  beforeAll(async () => {
    await setupDb();
    const learner = await User.create({ role: 'learner' });
    const other = await User.create({ role: 'learner' });
    const admin = await User.create({ role: 'admin' });
    learnerId = learner.id;
    learnerAuth = `Bearer ${await createSession(learner.id)}`;
    otherLearnerAuth = `Bearer ${await createSession(other.id)}`;
    adminAuth = `Bearer ${await createSession(admin.id)}`;
  });

  it('requires authentication and keeps the survey and export unavailable to incomplete learners', async () => {
    await request(app).get(surveyEndpoint).expect(401);
    await request(app).post(surveyEndpoint).send(submission).expect(401);
    await request(app).get(exportEndpoint).expect(401);
    await request(app).get(exportEndpoint).set('Authorization', otherLearnerAuth).expect(403);
    await request(app).get(workbookEndpoint).expect(401);
    await request(app).get(workbookEndpoint).set('Authorization', otherLearnerAuth).expect(403);
    await request(app).get(surveyEndpoint).set('Authorization', otherLearnerAuth).expect(200, { status: 'locked' });
    await request(app).post(surveyEndpoint).set('Authorization', otherLearnerAuth).send(submission).expect(403);
  });

  it('opens after all required quizzes pass, saves the first complete answer set and exports it by study code', async () => {
    await LessonProgress.bulkCreate(COURSE_MODULES.flatMap(module =>
      module.lessons.map(lessonId => ({ userId: learnerId, moduleId: module.id, lessonId, completed: true }))
    ));
    const quizzes = COURSE_MODULES.map(module => ({
      userId: learnerId,
      moduleId: module.id,
      totalQuestions: module.questions.length,
      score: module.questions.length,
      passed: true
    }));
    await QuizSubmission.bulkCreate(quizzes.slice(0, -1));
    await request(app).get(surveyEndpoint).set('Authorization', learnerAuth).expect(200, { status: 'locked' });

    await QuizSubmission.create(quizzes.at(-1)!);
    expect(await Certificate.count({ where: { userId: learnerId } })).toBe(0);
    await request(app).get(surveyEndpoint).set('Authorization', learnerAuth).expect(200, { status: 'available' });
    await request(app).post(surveyEndpoint).set('Authorization', learnerAuth)
      .send({ ...submission, answers: answers.slice(1) }).expect(400);
    await request(app).post(surveyEndpoint).set('Authorization', learnerAuth)
      .send({ ...submission, answers: [6, ...answers.slice(1)] }).expect(400);

    await Promise.all([1, 2].map(() => request(app).post(surveyEndpoint).set('Authorization', learnerAuth)
      .send(submission).expect(200, { status: 'submitted' })));
    await request(app).post(surveyEndpoint).set('Authorization', learnerAuth)
      .send({ answers: answers.map(() => 3), language: 'en' }).expect(200, { status: 'submitted' });
    await request(app).get(surveyEndpoint).set('Authorization', learnerAuth).expect(200, { status: 'submitted' });
    await request(app).get(surveyEndpoint).set('Authorization', otherLearnerAuth).expect(200, { status: 'locked' });

    const rows = await CourseUsabilityResponse.findAll();
    expect(rows).toHaveLength(1);
    const response = rows[0]!;
    expect(response.answers).toEqual(answers);
    expect(response.language).toBe('sw');
    const csv = await request(app).get(exportEndpoint).set('Authorization', adminAuth).expect(200);
    expect(csv.headers['content-type']).toMatch(/^text\/csv/);
    expect(csv.text).toBe(
      'study_code,submitted_at,language,sus1,sus2,sus3,sus4,sus5,sus6,sus7,sus8,sus9,sus10,sus_score,comment\r\n' +
      `"${response.studyCode}","${response.createdAt.toISOString()}","sw","4","2","4","2","4","2","4","2","4","2","75","Mafunzo yalikuwa wazi."\r\n`
    );
    expect(csv.text).not.toContain(learnerId);

    const workbook = await request(app).get(workbookEndpoint).set('Authorization', adminAuth)
      .buffer(true)
      .parse((stream, done) => {
        const chunks: Buffer[] = [];
        stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
        stream.on('end', () => done(null, Buffer.concat(chunks)));
        stream.on('error', done);
      })
      .expect(200)
      .expect('Cache-Control', 'no-store')
      .expect('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .expect('Content-Disposition', 'attachment; filename="nairobi-climate-justice-sus.xlsx"');
    expect(workbook.body.subarray(0, 4)).toEqual(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
  });
});
