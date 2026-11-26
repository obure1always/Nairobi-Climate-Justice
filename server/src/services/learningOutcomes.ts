import { createHash } from 'crypto';
import { Op } from 'sequelize';
import { LearningOutcomeResponse, LessonProgress, ModuleProgress, QuizSubmission } from '../models/index';
import { hasCompletedCourse } from './courseProgress';
import {
  CONFIDENCE_ITEMS, KNOWLEDGE_QUESTIONS, OUTCOMES_VERSION,
  type OutcomeMetric, type OutcomeScores, type OutcomeStatus, type OutcomeSubmission, type OutcomeSummary
} from '../../../shared/learningOutcomes';

// Not sent in the public question catalogue or a baseline response.
export const OUTCOME_ANSWER_KEY: Record<string, number> = {
  heat: 2, drainage: 1, adaptation: 0, preparedness: 2,
  fairness: 1, participation: 0, evidence: 2, maladaptation: 1
};
const rating = (value: unknown): value is number => Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
const fourRatings = (value: unknown): value is number[] => Array.isArray(value) && value.length === 4 && value.every(rating);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const mean = (values: number[]): number | null => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
export const rounded = (value: number | null): number | null => value === null ? null : Math.round((value + Number.EPSILON) * 100) / 100;

export function parseOutcomeSubmission(body: unknown): OutcomeSubmission | null {
  if (!body || typeof body !== 'object') return null;
  const data = body as Record<string, unknown>;
  if (data.instrumentVersion !== OUTCOMES_VERSION || data.consent !== true ||
      (data.phase !== 'baseline' && data.phase !== 'endline') ||
      (data.language !== 'en' && data.language !== 'sw') ||
      typeof data.clientSubmissionId !== 'string' || !uuid.test(data.clientSubmissionId) ||
      !fourRatings(data.confidence) || !rating(data.intention)) return null;
  if (!data.knowledge || typeof data.knowledge !== 'object' || Array.isArray(data.knowledge)) return null;
  const knowledge = data.knowledge as Record<string, unknown>;
  if (Object.keys(knowledge).length !== KNOWLEDGE_QUESTIONS.length || !KNOWLEDGE_QUESTIONS.every(question =>
    Object.hasOwn(knowledge, question.id) && Number.isInteger(knowledge[question.id]) &&
    Number(knowledge[question.id]) >= 0 && Number(knowledge[question.id]) < question.options.en.length
  )) return null;
  if (data.comment !== undefined && (typeof data.comment !== 'string' || data.comment.length > 600)) return null;
  if (data.phase === 'baseline' && (data.notStarted !== true || data.recalledConfidence !== undefined || data.recalledIntention !== undefined)) return null;
  const hasRecall = data.recalledConfidence !== undefined || data.recalledIntention !== undefined;
  if (hasRecall && (data.phase !== 'endline' || !fourRatings(data.recalledConfidence) || !rating(data.recalledIntention))) return null;
  return {
    instrumentVersion: OUTCOMES_VERSION, clientSubmissionId: data.clientSubmissionId,
    phase: data.phase, language: data.language, consent: true,
    ...(data.phase === 'baseline' ? { notStarted: true as const } : {}),
    knowledge: Object.fromEntries(KNOWLEDGE_QUESTIONS.map(question => [question.id, Number(knowledge[question.id])])),
    confidence: [...data.confidence], intention: data.intention,
    ...(hasRecall ? { recalledConfidence: [...data.recalledConfidence as number[]], recalledIntention: Number(data.recalledIntention) } : {}),
    ...(typeof data.comment === 'string' ? { comment: data.comment.trim() } : {})
  };
}

export function scoreOutcomes(submission: Pick<OutcomeSubmission, 'knowledge' | 'confidence' | 'intention'>): OutcomeScores {
  const correct = (id: string) => Number(submission.knowledge[id] === OUTCOME_ANSWER_KEY[id]);
  const knowledgeCorrect = KNOWLEDGE_QUESTIONS.reduce((sum, question) => sum + correct(question.id), 0);
  const justice = KNOWLEDGE_QUESTIONS.filter(question => question.domain === 'justice');
  return {
    knowledgeCorrect,
    knowledgePercent: knowledgeCorrect / KNOWLEDGE_QUESTIONS.length * 100,
    justicePercent: justice.reduce((sum, question) => sum + correct(question.id), 0) / justice.length * 100,
    confidenceMean: mean(submission.confidence)!, intention: submission.intention
  };
}

export async function hasLearningActivity(userId: string) {
  const counts = await Promise.all([
    LessonProgress.count({ where: { userId } }),
    ModuleProgress.count({ where: { userId } }),
    QuizSubmission.count({ where: { userId } })
  ]);
  return counts.some(count => count > 0);
}

export const outcomeStudyCode = (userId: string) => 'LO-' + createHash('sha256')
  .update(`nairobi-climate-justice:${OUTCOMES_VERSION}:${userId}`).digest('hex').slice(0, 20).toUpperCase();

export function scoresFromRow(row: LearningOutcomeResponse): OutcomeScores {
  return { knowledgeCorrect: row.knowledgeCorrect, knowledgePercent: row.knowledgePercent,
    justicePercent: row.justicePercent, confidenceMean: row.confidenceMean, intention: row.intention };
}

export async function getOutcomeStatus(userId: string): Promise<OutcomeStatus> {
  const rows = await LearningOutcomeResponse.findAll({ where: { userId, instrumentVersion: OUTCOMES_VERSION } });
  const baseline = rows.find(row => row.phase === 'baseline');
  const endline = rows.find(row => row.phase === 'endline');
  const courseComplete = await hasCompletedCourse(userId);
  const status: OutcomeStatus['status'] = endline ? 'submitted' : courseComplete ? 'endline_available'
    : baseline ? 'baseline_saved' : await hasLearningActivity(userId) ? 'learning_in_progress' : 'baseline_available';
  return { instrumentVersion: OUTCOMES_VERSION, status, hasBaseline: Boolean(baseline), courseComplete,
    baseline: baseline ? scoresFromRow(baseline) : null, endline: endline ? scoresFromRow(endline) : null };
}

export type OutcomeRow = Pick<LearningOutcomeResponse, 'userId' | 'studyCode' | 'instrumentVersion' | 'phase' | 'language' |
  'knowledge' | 'confidence' | 'intention' | 'recalledConfidence' | 'recalledIntention' | 'comment' | 'createdAt' |
  'knowledgeCorrect' | 'knowledgePercent' | 'justicePercent' | 'confidenceMean'>;

export function getOutcomePairs(rows: OutcomeRow[]) {
  const learners = new Map<string, { baseline?: OutcomeRow; endline?: OutcomeRow }>();
  for (const row of rows) {
    if (row.instrumentVersion !== OUTCOMES_VERSION) continue;
    const entry = learners.get(row.userId) ?? {};
    entry[row.phase] = row;
    learners.set(row.userId, entry);
  }
  return [...learners.values()].flatMap(entry => entry.baseline && entry.endline &&
    entry.baseline.createdAt.getTime() <= entry.endline.createdAt.getTime()
    ? [{ before: entry.baseline, after: entry.endline }] : []);
}

export const OUTCOME_NOTES = [
  'Before-and-after changes use the same learners with both responses to this instrument version. Missing responses are not scored as zero.',
  'Knowledge is the percentage correct across eight questions. Climate justice uses two of those questions and is a small descriptive subscore.',
  'Confidence is the mean of four self-ratings from 1 (not at all confident) to 5 (completely confident). Intention is one rating from 1 (very unlikely) to 5 (very likely).',
  'Knowledge changes are percentage points. Confidence and intention changes are scale points, not percentages.',
  'Recalled before-course ratings were collected after completion. They are shown separately and are not a measured baseline. Intention is not evidence that an action occurred.',
  'This is a short project-developed instrument, not a validated standardised literacy scale. Without a comparison group, changes alone do not establish that the application caused them.',
  'Legacy baseline/endline answers and SUS responses use different questions and are not combined with these results. Exports contain coded records, not learner names or email addresses.'
];

export function calculateOutcomeSummary(inputRows: OutcomeRow[], generatedAt = new Date().toISOString()): OutcomeSummary {
  const rows = inputRows.filter(row => row.instrumentVersion === OUTCOMES_VERSION);
  const pairs = getOutcomePairs(rows);
  const pairedIds = new Set(pairs.map(pair => pair.after.userId));
  const beforeRows = rows.filter(row => row.phase === 'baseline');
  const afterRows = rows.filter(row => row.phase === 'endline');
  const afterOnly = afterRows.filter(row => !pairedIds.has(row.userId));
  const recalled = afterOnly.filter(row => fourRatings(row.recalledConfidence) && rating(row.recalledIntention));
  const metric = (id: OutcomeMetric['id'], label: string, scale: string, get: (row: OutcomeRow) => number): OutcomeMetric => ({
    id, label, scale, before: rounded(mean(pairs.map(pair => get(pair.before)))),
    after: rounded(mean(pairs.map(pair => get(pair.after)))),
    change: rounded(mean(pairs.map(pair => get(pair.after) - get(pair.before)))), n: pairs.length
  });
  const itemResults: OutcomeSummary['itemResults'] = [
    ...KNOWLEDGE_QUESTIONS.map(question => {
      const get = (row: OutcomeRow) => Number(row.knowledge[question.id] === OUTCOME_ANSWER_KEY[question.id]) * 100;
      return { id: question.id, label: question.text.en, scale: '% correct',
        before: rounded(mean(pairs.map(pair => get(pair.before)))), after: rounded(mean(pairs.map(pair => get(pair.after)))),
        change: rounded(mean(pairs.map(pair => get(pair.after) - get(pair.before)))), n: pairs.length };
    }),
    ...CONFIDENCE_ITEMS.map((item, index) => ({ id: item.id, label: item.en, scale: '1–5 confidence',
      before: rounded(mean(pairs.map(pair => pair.before.confidence[index]!))),
      after: rounded(mean(pairs.map(pair => pair.after.confidence[index]!))),
      change: rounded(mean(pairs.map(pair => pair.after.confidence[index]! - pair.before.confidence[index]!))), n: pairs.length }))
  ];
  return {
    instrumentVersion: OUTCOMES_VERSION, generatedAt,
    counts: { learnersResponded: new Set(rows.map(row => row.userId)).size, baselineResponses: beforeRows.length,
      endlineResponses: afterRows.length, matchedPairs: pairs.length, baselineOnly: beforeRows.filter(row => !pairedIds.has(row.userId)).length,
      endlineOnly: afterOnly.length, languageChangedPairs: pairs.filter(pair => pair.before.language !== pair.after.language).length,
      recalledResponses: recalled.length },
    metrics: [metric('knowledge', 'Climate knowledge', '0–100%', row => row.knowledgePercent),
      metric('justice', 'Climate justice (2 questions)', '0–100%', row => row.justicePercent),
      metric('confidence', 'Confidence to act', '1–5', row => row.confidenceMean),
      metric('intention', 'Intention to act in 30 days', '1–5', row => row.intention)],
    knowledgeChange: {
      improved: pairs.filter(pair => pair.after.knowledgeCorrect > pair.before.knowledgeCorrect).length,
      unchanged: pairs.filter(pair => pair.after.knowledgeCorrect === pair.before.knowledgeCorrect).length,
      lower: pairs.filter(pair => pair.after.knowledgeCorrect < pair.before.knowledgeCorrect).length
    },
    endlineOnly: { knowledgePercent: rounded(mean(afterOnly.map(row => row.knowledgePercent))),
      confidenceMean: rounded(mean(afterOnly.map(row => row.confidenceMean))), intention: rounded(mean(afterOnly.map(row => row.intention))) },
    recalled: {
      confidenceBefore: rounded(mean(recalled.map(row => mean(row.recalledConfidence!)!))),
      confidenceAfter: rounded(mean(recalled.map(row => row.confidenceMean))),
      confidenceChange: rounded(mean(recalled.map(row => row.confidenceMean - mean(row.recalledConfidence!)!))),
      intentionBefore: rounded(mean(recalled.map(row => row.recalledIntention!))),
      intentionAfter: rounded(mean(recalled.map(row => row.intention))),
      intentionChange: rounded(mean(recalled.map(row => row.intention - row.recalledIntention!)))
    }, itemResults, notes: [...OUTCOME_NOTES]
  };
}

export async function getOutcomeDataset() {
  const generatedAt = new Date();
  const rows = await LearningOutcomeResponse.findAll({
    where: { instrumentVersion: OUTCOMES_VERSION, createdAt: { [Op.lte]: generatedAt } }, order: [['createdAt', 'ASC']]
  });
  return { rows, summary: calculateOutcomeSummary(rows, generatedAt.toISOString()) };
}
