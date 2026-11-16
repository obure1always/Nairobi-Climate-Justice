import { CourseUsabilityResponse } from '../models/index';

const QUESTION_COUNT = 10;
const COMMENT_LIMIT = 1000;

interface UsabilitySubmission {
  language: 'en' | 'sw';
  answers: number[];
  comment: string | null;
}

export function parseUsabilitySubmission(body: unknown): UsabilitySubmission | null {
  if (!body || typeof body !== 'object') return null;
  const { language, answers, comment } = body as Record<string, unknown>;
  if (language !== 'en' && language !== 'sw') return null;
  if (!Array.isArray(answers) || answers.length !== QUESTION_COUNT ||
      !answers.every(answer => Number.isInteger(answer) && answer >= 1 && answer <= 5)) {
    return null;
  }
  if (comment !== undefined && (typeof comment !== 'string' || comment.length > COMMENT_LIMIT)) {
    return null;
  }
  return { language, answers, comment: typeof comment === 'string' ? comment.trim() || null : null };
}

function scoreSus(answers: number[]) {
  // Odd-numbered items contribute rating minus 1, and even items contribute 5 minus rating.
  const total = answers.reduce((sum, rating, index) => {
    const contribution = index % 2 === 0 ? rating - 1 : 5 - rating;
    return sum + contribution;
  }, 0);
  return total * 2.5;
}

function quoteCsv(value: string | number) {
  const text = String(value);
  const safe = /^[=+\-@]/.test(text.trimStart()) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function exportCourseUsabilityCsv() {
  const responses = await CourseUsabilityResponse.findAll({
    attributes: ['studyCode', 'createdAt', 'language', 'answers', 'comment'],
    order: [['createdAt', 'ASC']]
  });
  const questionColumns = Array.from({ length: QUESTION_COUNT }, (_, index) => `sus${index + 1}`);
  const header = ['study_code', 'submitted_at', 'language', ...questionColumns, 'sus_score', 'comment'];
  const rows = responses.map(response => [
    response.studyCode,
    response.createdAt.toISOString(),
    response.language,
    ...response.answers,
    scoreSus(response.answers),
    response.comment ?? ''
  ].map(quoteCsv).join(','));
  return [header.join(','), ...rows].join('\r\n') + '\r\n';
}
