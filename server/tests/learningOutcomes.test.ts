import { randomUUID } from 'crypto';
import request from 'supertest';
import { PDFDocument } from 'pdf-lib';
import app from '../src/index';
import { LearningOutcomeResponse, LessonProgress, ModuleProgress, QuizSubmission, setupDb, User } from '../src/models/index';
import { createSession } from '../src/services/authService';
import { COURSE_MODULES } from '../src/services/courseCatalog';
import { calculateOutcomeSummary, OUTCOME_ANSWER_KEY, parseOutcomeSubmission, scoreOutcomes, type OutcomeRow } from '../src/services/learningOutcomes';
import { KNOWLEDGE_QUESTIONS, OUTCOMES_VERSION, type OutcomeSubmission } from '../../shared/learningOutcomes';

const base = '/api/v1/learning-outcomes';
const knowledge = (correct = true) => Object.fromEntries(KNOWLEDGE_QUESTIONS.map(question =>
  [question.id, correct ? OUTCOME_ANSWER_KEY[question.id] : (OUTCOME_ANSWER_KEY[question.id]! + 1) % 3]));
const submission = (phase: 'baseline' | 'endline' = 'baseline'): OutcomeSubmission => ({
  instrumentVersion: OUTCOMES_VERSION, clientSubmissionId: randomUUID(), phase, language: 'en', consent: true,
  ...(phase === 'baseline' ? { notStarted: true } : {}), knowledge: knowledge(), confidence: [2, 3, 4, 5], intention: 4
});
const row = (userId: string, phase: 'baseline' | 'endline', values: Partial<OutcomeRow> = {}): OutcomeRow => {
  const answers = submission(phase);
  return { userId, studyCode: 'LO-' + userId, instrumentVersion: OUTCOMES_VERSION, phase, language: 'en',
    createdAt: new Date(phase === 'baseline' ? '2026-11-01T00:00:00Z' : '2026-11-20T00:00:00Z'),
    knowledge: answers.knowledge, confidence: answers.confidence, intention: answers.intention,
    recalledConfidence: null, recalledIntention: null, comment: null, ...scoreOutcomes(answers), ...values };
};

describe('Learning outcome scoring and matching', () => {
  it('accepts only complete, consented, versioned answers and bounded ratings', () => {
    const valid = submission();
    expect(parseOutcomeSubmission(valid)).not.toBeNull();
    const badBodies = [null, { ...valid, consent: false }, { ...valid, notStarted: false },
      { ...valid, instrumentVersion: 'unknown' }, { ...valid, language: 'xx' }, { ...valid, phase: 'survey' },
      { ...valid, clientSubmissionId: 'not-a-uuid' }, { ...valid, confidence: [1, 2, 3] },
      { ...valid, confidence: [1, 2, 3, 6] }, { ...valid, confidence: ['1', 2, 3, 4] },
      { ...valid, intention: 0 }, { ...valid, knowledge: { ...valid.knowledge, heat: 4 } },
      { ...valid, knowledge: { ...valid.knowledge, extra: 1 } }, { ...valid, knowledge: {} },
      { ...valid, recalledConfidence: [1, 2, 3, 4], recalledIntention: 3 }, { ...valid, comment: 'x'.repeat(601) }];
    for (const body of badBodies) expect(parseOutcomeSubmission(body)).toBeNull();
    expect(parseOutcomeSubmission({ ...submission('endline'), recalledConfidence: [1, 2, 3, 4] })).toBeNull();
  });

  it('grades the answer key and keeps confidence and intention on their own scales', () => {
    expect(scoreOutcomes(submission())).toEqual({ knowledgeCorrect: 8, knowledgePercent: 100, justicePercent: 100, confidenceMean: 3.5, intention: 4 });
    expect(scoreOutcomes({ ...submission(), knowledge: knowledge(false), confidence: [1, 1, 1, 1], intention: 1 }))
      .toEqual({ knowledgeCorrect: 0, knowledgePercent: 0, justicePercent: 0, confidenceMean: 1, intention: 1 });
  });

  it('does not turn absent observations into zeros or mix unmatched or recalled ratings into changes', () => {
    const empty = calculateOutcomeSummary([]);
    expect(empty.metrics.every(metric => metric.n === 0 && metric.before === null && metric.after === null && metric.change === null)).toBe(true);
    const result = calculateOutcomeSummary([
      row('paired', 'baseline', { knowledge: knowledge(false), knowledgeCorrect: 0, knowledgePercent: 0, justicePercent: 0, confidence: [1, 2, 3, 4], confidenceMean: 2.5, intention: 2 }),
      row('paired', 'endline', { language: 'sw' }), row('before-only', 'baseline'),
      row('after-only', 'endline', { recalledConfidence: [1, 1, 1, 1], recalledIntention: 1, confidenceMean: 5, confidence: [5, 5, 5, 5], intention: 5 }),
      row('legacy', 'baseline', { instrumentVersion: 'old-instrument' })
    ]);
    expect(result.counts).toEqual({ learnersResponded: 3, baselineResponses: 2, endlineResponses: 2, matchedPairs: 1,
      baselineOnly: 1, endlineOnly: 1, languageChangedPairs: 1, recalledResponses: 1 });
    expect(result.metrics[0]).toMatchObject({ before: 0, after: 100, change: 100, n: 1 });
    expect(result.metrics[2]).toMatchObject({ before: 2.5, after: 3.5, change: 1 });
    expect(result.metrics[3]).toMatchObject({ before: 2, after: 4, change: 2 });
    expect(result.recalled.confidenceChange).toBe(4);
    expect(result.knowledgeChange).toEqual({ improved: 1, unchanged: 0, lower: 0 });
  });

  it('excludes reversed timestamps and distinguishes lower scores from improvement', () => {
    const result = calculateOutcomeSummary([
      row('reversed', 'baseline', { createdAt: new Date('2026-11-25') }), row('reversed', 'endline'),
      row('lower', 'baseline'), row('lower', 'endline', { knowledgeCorrect: 0, knowledgePercent: 0 })
    ]);
    expect(result.counts.matchedPairs).toBe(1);
    expect(result.knowledgeChange).toEqual({ improved: 0, unchanged: 0, lower: 1 });
    expect(result.metrics[0]!.change).toBe(-100);
  });
});

describe('Learning outcomes API and exports', () => {
  let adminAuth: string;
  const account = async (role = 'learner') => {
    const user = await User.create({ role, name: 'Private learner', email: `${randomUUID()}@example.test` });
    return { user, auth: `Bearer ${await createSession(user.id)}` };
  };
  const complete = async (userId: string) => {
    await LessonProgress.bulkCreate(COURSE_MODULES.flatMap(module => module.lessons.map(lessonId => ({ userId, moduleId: module.id, lessonId, completed: true }))));
    await QuizSubmission.bulkCreate(COURSE_MODULES.map(module => ({ userId, moduleId: module.id, totalQuestions: module.questions.length, score: module.questions.length, passed: true })));
  };
  beforeAll(async () => { await setupDb(); adminAuth = (await account('admin')).auth; });
  beforeEach(async () => {
    await LearningOutcomeResponse.destroy({ where: {} }); await LessonProgress.destroy({ where: {} });
    await ModuleProgress.destroy({ where: {} }); await QuizSubmission.destroy({ where: {} });
  });

  it('protects learner responses and restricts every results/export route to admins', async () => {
    const learner = await account();
    await request(app).get(`${base}/status`).expect(401);
    await request(app).post(`${base}/responses`).send(submission()).expect(401);
    await request(app).get(`${base}/status`).set('Authorization', adminAuth).expect(403);
    for (const path of ['/api/v1/admin/learning-outcomes', '/api/v1/admin/export/learning-outcomes.xlsx', '/api/v1/admin/export/learning-outcomes.pdf']) {
      await request(app).get(path).expect(401);
      await request(app).get(path).set('Authorization', learner.auth).expect(403);
    }
  });

  it('stores a baseline once, ignores client scores/ownership and acknowledges a retry after learning starts', async () => {
    const learner = await account(); const other = await account();
    const payload = { ...submission(), knowledge: knowledge(false), confidence: [1, 1, 1, 1], userId: other.user.id, knowledgePercent: 100 };
    await request(app).get(`${base}/status`).set('Authorization', learner.auth).expect(200).expect(response => expect(response.body.status).toBe('baseline_available'));
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth).send(payload).expect(200).expect('Cache-Control', 'no-store');
    const stored = await LearningOutcomeResponse.findOne({ where: { userId: learner.user.id } });
    expect(stored!.knowledgePercent).toBe(0); expect(stored!.confidenceMean).toBe(1);
    expect(await LearningOutcomeResponse.count({ where: { userId: other.user.id } })).toBe(0);
    await LessonProgress.create({ userId: learner.user.id, moduleId: 'm1', lessonId: 'm1-l1', completed: true });
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth).send(payload).expect(200)
      .expect(response => expect(response.body.duplicate).toBe(true));
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth).send(submission()).expect(200);
    expect(await LearningOutcomeResponse.count()).toBe(1);
    expect((await stored!.reload()).knowledgePercent).toBe(0);
  });

  it('does not accept a late baseline or an endline before verified course completion', async () => {
    const learner = await account();
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth).send(submission('endline')).expect(403);
    await LessonProgress.create({ userId: learner.user.id, moduleId: 'm1', lessonId: 'm1-l1', completed: false });
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth).send(submission()).expect(409);
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth).send({ ...submission(), consent: false }).expect(400);
    expect(await LearningOutcomeResponse.count()).toBe(0);
  });

  it('retains an endline-only learner and optional recall without inventing a baseline', async () => {
    const learner = await account(); await complete(learner.user.id);
    await request(app).get(`${base}/status`).set('Authorization', learner.auth).expect(200)
      .expect(response => { expect(response.body.status).toBe('endline_available'); expect(response.body.hasBaseline).toBe(false); });
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth)
      .send({ ...submission('endline'), recalledConfidence: [1, 1, 1, 1], recalledIntention: 1 }).expect(200);
    const result = await request(app).get('/api/v1/admin/learning-outcomes').set('Authorization', adminAuth).expect(200);
    expect(result.body.counts.endlineOnly).toBe(1); expect(result.body.counts.matchedPairs).toBe(0);
    expect(result.body.metrics[0].change).toBeNull(); expect(result.body.counts.recalledResponses).toBe(1);
  });

  it('matches before/after records, prevents duplicate phase races and exports real Excel and two-page PDF files', async () => {
    const learner = await account(); const before = { ...submission(), knowledge: knowledge(false), confidence: [1, 1, 1, 1], intention: 1 };
    await Promise.all([1, 2].map(() => request(app).post(`${base}/responses`).set('Authorization', learner.auth).send(before).expect(200)));
    await complete(learner.user.id);
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth).send(submission('endline')).expect(200);
    expect(await LearningOutcomeResponse.count()).toBe(2);
    const result = await request(app).get('/api/v1/admin/learning-outcomes').set('Authorization', adminAuth).expect(200);
    expect(result.body.counts.matchedPairs).toBe(1); expect(result.body.metrics[0]).toMatchObject({ before: 0, after: 100, change: 100 });
    expect(JSON.stringify(result.body)).not.toContain(learner.user.email);
    expect(JSON.stringify(result.body)).not.toContain(learner.user.id);
    const binary = (stream: NodeJS.ReadableStream, done: (error: Error | null, data?: Buffer) => void) => {
      const chunks: Buffer[] = []; stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => done(null, Buffer.concat(chunks))); stream.on('error', done);
    };
    const excel = await request(app).get('/api/v1/admin/export/learning-outcomes.xlsx').set('Authorization', adminAuth)
      .buffer(true).parse(binary).expect(200).expect('Cache-Control', 'no-store')
      .expect('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(excel.body.subarray(0, 2).toString()).toBe('PK');
    const pdf = await request(app).get('/api/v1/admin/export/learning-outcomes.pdf').set('Authorization', adminAuth)
      .buffer(true).parse(binary).expect(200).expect('Content-Type', 'application/pdf');
    expect((await PDFDocument.load(pdf.body)).getPageCount()).toBe(2);
  });

  it('withdraws only the signed-in learner’s responses and cascades account deletion', async () => {
    const learner = await account(); const other = await account();
    await request(app).post(`${base}/responses`).set('Authorization', learner.auth).send(submission()).expect(200);
    await request(app).post(`${base}/responses`).set('Authorization', other.auth).send(submission()).expect(200);
    await request(app).delete(`${base}/responses`).set('Authorization', learner.auth).send({ userId: other.user.id }).expect(200, { withdrawn: true });
    expect(await LearningOutcomeResponse.count({ where: { userId: other.user.id } })).toBe(1);
    await other.user.destroy();
    expect(await LearningOutcomeResponse.count()).toBe(0);
  });
});
