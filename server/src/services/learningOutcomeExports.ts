import writeExcelFile, { type SheetData } from 'write-excel-file/node';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { CONFIDENCE_ITEMS, KNOWLEDGE_QUESTIONS, OUTCOMES_VERSION } from '../../../shared/learningOutcomes';
import { getOutcomeDataset, getOutcomePairs, OUTCOME_ANSWER_KEY } from './learningOutcomes';

const header = (values: string[]) => values.map(value => ({ value, fontWeight: 'bold' as const, bottomBorderStyle: 'thin' as const, wrap: true, height: 34 }));
const textCell = (value: string) => ({ value, type: String, wrap: true, height: Math.max(28, Math.ceil(value.length / 65) * 18) });
const difference = (after: number, before: number) => Math.round((after - before) * 100) / 100;

export async function createOutcomeWorkbook() {
  const { rows, summary } = await getOutcomeDataset();
  const pairs = getOutcomePairs(rows);
  const summaryData: SheetData = [
    [{ value: 'Nairobi Climate Justice: Learning Outcomes', fontWeight: 'bold', fontSize: 16, columnSpan: 6, height: 30 }],
    ['Snapshot (UTC)', summary.generatedAt], ['Instrument version', OUTCOMES_VERSION], [],
    header(['Participation', 'Learners / responses']),
    ['Learners who responded', summary.counts.learnersResponded],
    ['Before-course responses', summary.counts.baselineResponses],
    ['After-course responses', summary.counts.endlineResponses],
    ['Matched learners', summary.counts.matchedPairs],
    ['Before response only', summary.counts.baselineOnly],
    ['After response only', summary.counts.endlineOnly],
    ['Matched learners who changed language', summary.counts.languageChangedPairs], [],
    header(['Matched learners only', 'Before mean', 'After mean', 'Mean change', 'Matched n', 'Scale / change unit']),
    ...summary.metrics.map(item => [item.label, item.before, item.after, item.change, item.n,
      item.id === 'knowledge' || item.id === 'justice' ? '0–100%; percentage points' : '1–5; scale points']), [],
    ['Knowledge improved', summary.knowledgeChange.improved], ['Knowledge unchanged', summary.knowledgeChange.unchanged],
    ['Knowledge score lower', summary.knowledgeChange.lower], [],
    header(['After response only: no measured baseline', 'Current mean', 'n']),
    ['Knowledge (%)', summary.endlineOnly.knowledgePercent, summary.counts.endlineOnly],
    ['Confidence (1–5)', summary.endlineOnly.confidenceMean, summary.counts.endlineOnly],
    ['Intention (1–5)', summary.endlineOnly.intention, summary.counts.endlineOnly], [],
    header(['Optional recalled ratings: not a measured baseline', 'Recalled before', 'Current after', 'Change', 'n']),
    ['Confidence (1–5)', summary.recalled.confidenceBefore, summary.recalled.confidenceAfter, summary.recalled.confidenceChange, summary.counts.recalledResponses],
    ['Intention (1–5)', summary.recalled.intentionBefore, summary.recalled.intentionAfter, summary.recalled.intentionChange, summary.counts.recalledResponses], [],
    ...summary.notes.map(note => [{ ...textCell(note), columnSpan: 6 }])
  ];
  const paired: SheetData = [header(['Study code', 'Before date (UTC)', 'After date (UTC)', 'Before language', 'After language',
    'Knowledge before (%)', 'Knowledge after (%)', 'Knowledge change (pp)', 'Justice before (%)', 'Justice after (%)', 'Justice change (pp)',
    'Confidence before (1–5)', 'Confidence after (1–5)', 'Confidence change', 'Intention before (1–5)', 'Intention after (1–5)', 'Intention change'])];
  for (const pair of pairs) paired.push([
    pair.before.studyCode, pair.before.createdAt, pair.after.createdAt, pair.before.language, pair.after.language,
    pair.before.knowledgePercent, pair.after.knowledgePercent, difference(pair.after.knowledgePercent, pair.before.knowledgePercent),
    pair.before.justicePercent, pair.after.justicePercent, difference(pair.after.justicePercent, pair.before.justicePercent),
    pair.before.confidenceMean, pair.after.confidenceMean, difference(pair.after.confidenceMean, pair.before.confidenceMean),
    pair.before.intention, pair.after.intention, difference(pair.after.intention, pair.before.intention)
  ]);
  const raw: SheetData = [header(['Study code', 'Phase', 'Submitted (UTC)', 'Language', 'Instrument version',
    ...KNOWLEDGE_QUESTIONS.map(item => item.id + ' (option 0–3)'),
    ...CONFIDENCE_ITEMS.map(item => item.id + ' (1–5)'), 'Intention (1–5)',
    ...CONFIDENCE_ITEMS.map(item => 'Recalled ' + item.id + ' (1–5)'), 'Recalled intention (1–5)',
    'Knowledge correct (0–8)', 'Knowledge (%)', 'Justice (%)', 'Confidence mean (1–5)', 'Optional comment'])];
  for (const row of rows) raw.push([
    row.studyCode, row.phase, row.createdAt, row.language, row.instrumentVersion,
    ...KNOWLEDGE_QUESTIONS.map(item => row.knowledge[item.id]!), ...row.confidence, row.intention,
    ...CONFIDENCE_ITEMS.map((_item, index) => row.recalledConfidence?.[index] ?? null), row.recalledIntention,
    row.knowledgeCorrect, row.knowledgePercent, row.justicePercent, row.confidenceMean,
    row.comment ? textCell(row.comment) : null
  ]);
  const items: SheetData = [header(['Item', 'Matched before mean', 'Matched after mean', 'Mean change', 'Scale', 'Matched n']),
    ...summary.itemResults.map(item => [textCell(item.label), item.before, item.after, item.change, item.scale, item.n])];
  const guide: SheetData = [
    header(['Item / measure', 'English wording / definition', 'Kiswahili wording', 'Scoring / options']),
    ...KNOWLEDGE_QUESTIONS.map(item => [item.id, textCell(item.text.en), textCell(item.text.sw),
      textCell(item.options.en.map((option, index) => `${index}: ${option}`).join('\n') + `\nCorrect option index: ${OUTCOME_ANSWER_KEY[item.id]}`)]),
    ...CONFIDENCE_ITEMS.map(item => [item.id, textCell(item.en), textCell(item.sw), '1 not at all; 2 slightly; 3 moderately; 4 very; 5 completely confident']),
    ['Intention', 'Likelihood of one safe practical climate action in the next 30 days.', '', '1 very unlikely; 2 unlikely; 3 neither; 4 likely; 5 very likely'],
    ['Matching', 'Same learner, same instrument version, before response at or before after response.', '', 'No unmatched observations in change estimates.'],
    ['Study codes', 'Coded identifiers remain linkable within the platform. Keep exports restricted.', '', 'Names, email addresses and account IDs are omitted.'],
    ['Missing values', 'Blank numeric cells mean no observation / no matched sample, not a zero score.', '', 'Do not replace blanks with zero.']
  ];
  return writeExcelFile([
    { data: summaryData, sheet: 'Summary', showGridLines: false, columns: [48, 22, 22, 20, 15, 40].map(width => ({ width })) },
    { data: paired, sheet: 'Matched learners', stickyRowsCount: 1, dateFormat: 'yyyy-mm-dd hh:mm:ss',
      columns: Array.from({ length: 17 }, (_value, index) => ({ width: index === 0 ? 28 : 24 })) },
    { data: raw, sheet: 'All responses', stickyRowsCount: 1, dateFormat: 'yyyy-mm-dd hh:mm:ss',
      columns: Array.from({ length: raw[0]!.length }, (_value, index) => ({ width: index === raw[0]!.length - 1 ? 60 : 25 })) },
    { data: items, sheet: 'Item results', stickyRowsCount: 1, columns: [85, 24, 24, 20, 20, 18].map(width => ({ width })) },
    { data: guide, sheet: 'Question guide', stickyRowsCount: 1, columns: [25, 85, 85, 100].map(width => ({ width })) }
  ], { fontFamily: 'Times New Roman', fontSize: 12 }).toBuffer();
}

export async function createOutcomePdf() {
  const { summary } = await getOutcomeDataset();
  const pdf = await PDFDocument.create();
  // Embed the platform's existing fonts so every PDF viewer uses the same glyphs and widths.
  pdf.registerFontkit(fontkit);
  const [regularBytes, boldBytes] = await Promise.all([
    readFile(path.resolve(__dirname, '../assets/NotoSans-Regular.ttf')),
    readFile(path.resolve(__dirname, '../assets/NotoSans-Bold.ttf'))
  ]);
  const [regular, bold] = await Promise.all([pdf.embedFont(regularBytes), pdf.embedFont(boldBytes)]);
  const black = rgb(0, 0, 0);
  const grey = rgb(0.65, 0.65, 0.65);
  const pages = [pdf.addPage([595.28, 841.89]), pdf.addPage([595.28, 841.89])];
  const shown = (value: number | null, suffix = '') => value === null ? 'No data' : value.toFixed(2) + suffix;
  const safe = (text: string) => text.replace(/\u2011/g, '-').replace(/\u2192/g, 'to');
  const paragraph = (pageIndex: number, text: string, y: number, size = 11, maxWidth = 491) => {
    let line = '';
    for (const word of safe(text).split(/\s+/)) {
      const next = line ? line + ' ' + word : word;
      if (regular.widthOfTextAtSize(next, size) > maxWidth && line) {
        pages[pageIndex]!.drawText(line, { x: 52, y, size, font: regular, color: black });
        y -= size + 5; line = word;
      } else line = next;
    }
    if (line) pages[pageIndex]!.drawText(line, { x: 52, y, size, font: regular, color: black });
    return y - size - 7;
  };
  const title = (index: number, label: string) => {
    const page = pages[index]!;
    page.drawText('Nairobi Climate Justice', { x: 52, y: 790, size: 18, font: bold });
    page.drawText(label, { x: 52, y: 766, size: 14, font: bold });
    paragraph(index, `Instrument ${OUTCOMES_VERSION} | Snapshot: ${summary.generatedAt.replace('T', ' ').slice(0, 19)} UTC`, 744, 9);
    page.drawText(`${index + 1} / 2`, { x: 510, y: 28, size: 10, font: regular });
  };
  title(0, 'Learning outcomes: before and after');
  let y = paragraph(0, `Learners responding: ${summary.counts.learnersResponded}. Before responses: ${summary.counts.baselineResponses}. After responses: ${summary.counts.endlineResponses}. Matched learners: ${summary.counts.matchedPairs}.`, 708);
  y = paragraph(0, 'Only the same learners with both responses are included in the table and charts below.', y);
  const page = pages[0]!;
  const columns = [52, 288, 363, 438, 514];
  page.drawLine({ start: { x: 52, y: y + 2 }, end: { x: 543, y: y + 2 }, thickness: 0.8 });
  ['Measure', 'Before', 'After', 'Change', 'n'].forEach((label, index) => page.drawText(label, { x: columns[index]!, y: y - 15, font: bold, size: 10 }));
  y -= 36;
  for (const metric of summary.metrics) {
    const label = metric.id === 'justice' ? 'Climate justice (2 items, %)' : metric.label + (metric.id === 'knowledge' ? ' (%)' : ' (1–5)');
    [label, shown(metric.before), shown(metric.after), shown(metric.change), String(metric.n)].forEach((value, index) => page.drawText(safe(value), { x: columns[index]!, y, font: regular, size: 10 }));
    y -= 24;
  }
  page.drawLine({ start: { x: 52, y: y + 8 }, end: { x: 543, y: y + 8 }, thickness: 0.8 });
  y = paragraph(0, 'Knowledge changes are percentage points. Confidence and intention changes are scale points.', y - 13, 10);
  const chart = (metricIndex: number, top: number, max: number) => {
    const metric = summary.metrics[metricIndex]!;
    page.drawText(metric.label + (max === 100 ? ' (%)' : ' (1–5)'), { x: 52, y: top, font: bold, size: 12 });
    if (metric.before === null || metric.after === null) {
      paragraph(0, 'No matched responses yet. Charts appear when learners submit both surveys.', top - 24);
      return;
    }
    const startX = 160, width = 330;
    for (const [index, value] of [metric.before, metric.after].entries()) {
      const barY = top - 36 - index * 38;
      page.drawText(index === 0 ? 'Before' : 'After', { x: 72, y: barY + 5, font: regular, size: 11 });
      page.drawRectangle({ x: startX, y: barY, width: width * value / max, height: 20, color: index === 0 ? grey : black });
      page.drawText(value.toFixed(2), { x: 500, y: barY + 5, font: bold, size: 11 });
    }
    page.drawText(`Scale: 0 to ${max}; matched sample n = ${metric.n} at both time points.`, { x: 160, y: top - 92, font: regular, size: 9 });
  };
  chart(0, y - 6, 100);
  chart(2, y - 122, 5);
  y = paragraph(0, `Knowledge scores: ${summary.knowledgeChange.improved} improved, ${summary.knowledgeChange.unchanged} unchanged, ${summary.knowledgeChange.lower} lower.`, y - 236, 10);
  paragraph(0, 'Observed change is not proof of causation. This short instrument is project-developed. See page 2 for other responses and interpretation.', y - 4, 10);

  title(1, 'Other responses and interpretation');
  y = paragraph(1, `Before response only: ${summary.counts.baselineOnly}. After response only: ${summary.counts.endlineOnly}. Matched learners who changed survey language: ${summary.counts.languageChangedPairs}.`, 708);
  y = paragraph(1, summary.counts.endlineOnly
    ? `After-only current means (n = ${summary.counts.endlineOnly}): knowledge ${shown(summary.endlineOnly.knowledgePercent, '%')}; confidence ${shown(summary.endlineOnly.confidenceMean)} / 5; intention ${shown(summary.endlineOnly.intention)} / 5. These describe current outcomes, not measured improvement.`
    : 'There are no after-only responses in this snapshot.', y - 6);
  pages[1]!.drawText('Optional recalled ratings', { x: 52, y: y - 8, font: bold, size: 12 });
  y = paragraph(1, summary.counts.recalledResponses
    ? `After-only learners providing recalled ratings: ${summary.counts.recalledResponses}. Confidence: ${shown(summary.recalled.confidenceBefore)} before (recalled), ${shown(summary.recalled.confidenceAfter)} now; change ${shown(summary.recalled.confidenceChange)} points. Intention: ${shown(summary.recalled.intentionBefore)} before (recalled), ${shown(summary.recalled.intentionAfter)} now; change ${shown(summary.recalled.intentionChange)} points.`
    : 'No recalled ratings were submitted. This optional section is kept separate from measured before-and-after results.', y - 30);
  pages[1]!.drawText('How to explain these results', { x: 52, y: y - 12, font: bold, size: 12 });
  y -= 38;
  for (let index = 0; index < summary.notes.length; index++) y = paragraph(1, `${index + 1}. ${summary.notes[index]}`, y, 10.5) - 5;
  paragraph(1, 'The Excel export contains the underlying coded responses, matched learner rows, item-level results and the question/scoring guide. Counts and means are calculated from saved responses; no sample results are inserted.', y - 4, 10.5);
  pdf.setTitle('Nairobi Climate Justice Learning Outcomes');
  pdf.setAuthor('Nairobi Climate Justice');
  return Buffer.from(await pdf.save());
}
