import type { Express, Request, RequestHandler } from 'express';
import { LearningOutcomeResponse, User } from '../models/index';
import { OUTCOMES_VERSION } from '../../../shared/learningOutcomes';
import { getOutcomeDataset, getOutcomeStatus, outcomeStudyCode, parseOutcomeSubmission, scoreOutcomes } from '../services/learningOutcomes';
import { createOutcomePdf, createOutcomeWorkbook } from '../services/learningOutcomeExports';

type AccountRequest = Request & { user?: User };

export function registerLearningOutcomeRoutes(app: Express, authenticate: RequestHandler, adminOnly: RequestHandler) {
  const learnerOnly: RequestHandler = (req: AccountRequest, res, next) => {
    if (req.user?.role !== 'learner') return res.status(403).json({ error: 'This survey is for learner accounts.' });
    next();
  };
  const privateResponse: RequestHandler = (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); };

  app.get('/api/v1/learning-outcomes/status', authenticate, learnerOnly, privateResponse, async (req: AccountRequest, res) => {
    res.json(await getOutcomeStatus(req.user!.id));
  });

  app.post('/api/v1/learning-outcomes/responses', authenticate, learnerOnly, privateResponse, async (req: AccountRequest, res) => {
    const submission = parseOutcomeSubmission(req.body);
    if (!submission) return res.status(400).json({ error: 'Complete the current survey, consent and every required answer using the offered options.' });
    const userId = req.user!.id;
    const where = { userId, instrumentVersion: OUTCOMES_VERSION, phase: submission.phase };
    // A retry after learning has begun must still acknowledge the already-saved baseline.
    if (await LearningOutcomeResponse.findOne({ where })) return res.json({ saved: true, duplicate: true, ...(await getOutcomeStatus(userId)) });
    const status = await getOutcomeStatus(userId);
    if (submission.phase === 'baseline' && status.status !== 'baseline_available') {
      return res.status(409).json({ error: 'Learning activity is already recorded. A before-course response cannot be added now. The after-course survey opens on completion.' });
    }
    if (submission.phase === 'endline' && !status.courseComplete) {
      return res.status(403).json({ error: 'Complete the required lessons and pass the module quizzes before the after-course survey.' });
    }
    if (status.hasBaseline && submission.recalledConfidence) return res.status(400).json({ error: 'Your recorded baseline is used; recalled ratings are not needed.' });
    if (await LearningOutcomeResponse.findOne({ where: { userId, clientSubmissionId: submission.clientSubmissionId } })) {
      return res.status(409).json({ error: 'This submission identifier was already used for a different survey phase.' });
    }
    await LearningOutcomeResponse.bulkCreate([{
      ...where, studyCode: outcomeStudyCode(userId), clientSubmissionId: submission.clientSubmissionId,
      consentedAt: new Date(), language: submission.language, knowledge: submission.knowledge,
      confidence: submission.confidence,
      recalledConfidence: submission.recalledConfidence ?? null, recalledIntention: submission.recalledIntention ?? null,
      comment: submission.comment || null, ...scoreOutcomes(submission)
    }], { ignoreDuplicates: true });
    if (!await LearningOutcomeResponse.findOne({ where })) return res.status(409).json({ error: 'The response could not be saved. Refresh your survey status and retry.' });
    res.json({ saved: true, ...(await getOutcomeStatus(userId)) });
  });

  app.delete('/api/v1/learning-outcomes/responses', authenticate, learnerOnly, privateResponse, async (req: AccountRequest, res) => {
    await LearningOutcomeResponse.destroy({ where: { userId: req.user!.id } });
    res.json({ withdrawn: true });
  });

  app.get('/api/v1/admin/learning-outcomes', adminOnly, privateResponse, async (_req, res) => {
    res.json((await getOutcomeDataset()).summary);
  });
  app.get('/api/v1/admin/export/learning-outcomes.xlsx', adminOnly, privateResponse, async (_req, res) => {
    res.attachment('nairobi-learning-outcomes.xlsx').send(await createOutcomeWorkbook());
  });
  app.get('/api/v1/admin/export/learning-outcomes.pdf', adminOnly, privateResponse, async (_req, res) => {
    res.attachment('nairobi-learning-outcomes.pdf').send(await createOutcomePdf());
  });
}
