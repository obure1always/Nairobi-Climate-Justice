import { CourseUsabilityResponse } from '../models/index';
import writeExcelFile, { type SheetData } from 'write-excel-file/node';

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

function getCourseUsabilityResponses() {
  return CourseUsabilityResponse.findAll({
    attributes: ['studyCode', 'createdAt', 'language', 'answers', 'comment'],
    order: [['createdAt', 'ASC']]
  });
}

export async function exportCourseUsabilityCsv() {
  const responses = await getCourseUsabilityResponses();
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

export async function exportCourseUsabilityWorkbook() {
  const responses = await getCourseUsabilityResponses();
  const questions = Array.from({ length: QUESTION_COUNT }, (_, index) => `SUS ${index + 1}`);
  const header = ['Study code', 'Submitted at (UTC)', 'Language', ...questions, 'SUS score', 'Comment'];
  const data: SheetData = [header.map(value => ({ value, fontWeight: 'bold' }))];
  for (const response of responses) {
    data.push([
      response.studyCode,
      response.createdAt,
      response.language,
      ...response.answers,
      scoreSus(response.answers),
      response.comment === null ? null : { value: response.comment, type: String, wrap: true }
    ]);
  }
  const widths = [38, 25, 12, ...questions.map(() => 8), 14, 64];
  return writeExcelFile(data, {
    sheet: 'Course feedback',
    columns: widths.map(width => ({ width })),
    stickyRowsCount: 1,
    dateFormat: 'yyyy-mm-dd hh:mm:ss'
  }).toBuffer();
}
