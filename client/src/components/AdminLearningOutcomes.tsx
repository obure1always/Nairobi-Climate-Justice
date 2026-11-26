import { useEffect, useState } from 'react';
import { apiUrl } from '../lib/api';
import type { OutcomeMetric, OutcomeSummary } from '../../../shared/learningOutcomes';

const controlClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-forest-green disabled:opacity-50';
const shown = (value: number | null, suffix = '') => value === null ? 'No data yet' : value.toFixed(2) + suffix;
const signed = (value: number | null) => value === null ? 'No data yet' : (value > 0 ? '+' : '') + value.toFixed(2);

function ComparisonChart({ metric, max }: { metric: OutcomeMetric; max: number }) {
  if (metric.before === null || metric.after === null) return <p className="text-sm text-gray-600">This chart appears when learners have submitted both surveys.</p>;
  const values = [metric.before, metric.after];
  return <svg viewBox="0 0 510 160" className="w-full" role="img" aria-label={`${metric.label}: before ${metric.before}, after ${metric.after}; ${metric.n} matched learners. Scale 0 to ${max}.`}>
    <title>{metric.label}: same learners before and after</title>
    {[0, 0.25, 0.5, 0.75, 1].map(tick => <g key={tick}>
      <line x1={90 + tick * 330} y1={18} x2={90 + tick * 330} y2={117} stroke="#dddddd" />
      <text x={90 + tick * 330} y={137} textAnchor="middle" fontSize={12} fill="#374151">{Math.round(tick * max * 100) / 100}</text>
    </g>)}
    {values.map((value, index) => <g key={index}>
      <text x={8} y={45 + index * 50} fontSize={14} fill="#111827">{index === 0 ? 'Before' : 'After'}</text>
      <rect x={90} y={25 + index * 50} width={Math.max(0, value / max * 330)} height={30} fill={index === 0 ? '#a3a3a3' : '#171717'} />
      <text x={435} y={45 + index * 50} fontSize={14} fontWeight="bold" fill="#111827">{value.toFixed(2)}{max === 100 ? '%' : ''}</text>
    </g>)}
  </svg>;
}

export default function AdminLearningOutcomes({ token }: { token: string }) {
  const [result, setResult] = useState<{ token: string; summary: OutcomeSummary } | null>(null);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState(false);
  const [exporting, setExporting] = useState<'xlsx' | 'pdf' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const summary = result?.token === token ? result.summary : null;
  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl('/admin/learning-outcomes'), { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Could not load results');
        const data = await response.json() as OutcomeSummary;
        if (!controller.signal.aborted) { setResult({ token, summary: data }); setError(false); }
      }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [token, version]);
  const download = async (format: 'xlsx' | 'pdf') => {
    if (exporting) return;
    setExporting(format); setExportError(null);
    try {
      const response = await fetch(apiUrl(`/admin/export/learning-outcomes.${format}`), {
        headers: { Authorization: `Bearer ${token}` }, cache: 'no-store'
      });
      const expectedType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!response.ok || !response.headers.get('content-type')?.includes(expectedType)) throw new Error('Export was not accepted');
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a'); anchor.href = url;
      anchor.download = `nairobi-learning-outcomes.${format}`; document.body.appendChild(anchor);
      anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setExportError(`The ${format.toUpperCase()} report could not be downloaded. Please retry.`); }
    finally { setExporting(null); }
  };
  return <section aria-labelledby="outcomes-admin-title" className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 id="outcomes-admin-title" className="text-2xl font-bold text-gray-900">Learning outcomes</h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-600">Climate knowledge, confidence and intention to act. Results are calculated from saved survey responses.</p></div>
      <button className={controlClass} onClick={() => setVersion(value => value + 1)}>Refresh survey results</button>
    </div>
    <div className="flex flex-wrap gap-3">
      <button className={controlClass} disabled={Boolean(exporting)} onClick={() => download('xlsx')}>{exporting === 'xlsx' ? 'Preparing Excel…' : 'Export learning results to Excel'}</button>
      <button className={controlClass} disabled={Boolean(exporting)} onClick={() => download('pdf')}>{exporting === 'pdf' ? 'Preparing PDF…' : 'Download presentation summary (PDF)'}</button>
    </div>
    {exportError && <p role="alert" className="text-sm text-red-700">{exportError}</p>}
    {error && <p role="alert" className="text-sm text-red-700">Survey results could not be refreshed. Any figures still shown are from the earlier snapshot.</p>}
    {!summary ? <p role="status">{error ? 'Use Refresh survey results to try again.' : 'Loading survey results…'}</p> : <>
      <p className="text-xs leading-relaxed text-gray-600">Snapshot: {new Date(summary.generatedAt).toLocaleString()} · Instrument: {summary.instrumentVersion}</p>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Learners responding', summary.counts.learnersResponded], ['Before responses', summary.counts.baselineResponses],
          ['After responses', summary.counts.endlineResponses], ['Matched learners', summary.counts.matchedPairs]
        ].map(([label, value]) => <div key={label} className="rounded-xl border border-gray-200 p-4"><dt className="text-sm text-gray-600">{label}</dt><dd className="mt-1 text-3xl font-bold">{value}</dd></div>)}
      </dl>
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Before and after: the same learners</h3>
        <p className="text-sm leading-relaxed text-gray-700">These changes use matched responses from {summary.counts.matchedPairs} {summary.counts.matchedPairs === 1 ? 'learner' : 'learners'}. Missing responses are not treated as zero.</p>
        {!summary.counts.matchedPairs && <p role="status" className="rounded-xl border border-gray-200 p-4">No matched results yet. Learners need a saved response before starting and another after completing the course. Existing course completers appear in the separate after-only section.</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] border-collapse text-left text-sm">
            <caption className="sr-only">Mean learning outcomes for matched learners</caption>
            <thead className="border-y border-gray-400"><tr>{['Measure', 'Before', 'After', 'Change', 'n'].map(label => <th key={label} scope="col" className="p-3">{label}</th>)}</tr></thead>
            <tbody>{summary.metrics.map(metric => <tr key={metric.id} className="border-b border-gray-200">
              <th scope="row" className="p-3 font-medium">{metric.label}<span className="block text-xs font-normal text-gray-500">{metric.scale}</span></th>
              <td className="p-3 tabular-nums">{shown(metric.before)}</td><td className="p-3 tabular-nums">{shown(metric.after)}</td>
              <td className="p-3 tabular-nums">{signed(metric.change)}{metric.change !== null ? (metric.id === 'knowledge' || metric.id === 'justice' ? ' pp' : ' points') : ''}</td>
              <td className="p-3">{metric.n}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600">pp = percentage points. Confidence and intention use 1–5 scales. Intention describes a plan, not a completed action.</p>
        <div className="grid gap-5 md:grid-cols-2">{[summary.metrics[0], summary.metrics[2]].map((metric, index) => metric && <figure key={metric.id} className="rounded-xl border border-gray-200 p-4">
          <figcaption className="mb-3 font-semibold">{metric.label} ({index === 0 ? '%' : '1–5'})</figcaption><ComparisonChart metric={metric} max={index === 0 ? 100 : 5} />
        </figure>)}</div>
        <p className="text-sm">Knowledge scores: <strong>{summary.knowledgeChange.improved}</strong> improved, <strong>{summary.knowledgeChange.unchanged}</strong> unchanged, <strong>{summary.knowledgeChange.lower}</strong> lower.</p>
      </div>
      <div className="space-y-3 border-t border-gray-200 pt-5">
        <h3 className="text-xl font-bold">Current results without a before-course response</h3>
        <p className="text-sm leading-relaxed text-gray-700">{summary.counts.endlineOnly ? <>After-only learners: <strong>{summary.counts.endlineOnly}</strong>. Mean knowledge: <strong>{shown(summary.endlineOnly.knowledgePercent, '%')}</strong>. Confidence: <strong>{shown(summary.endlineOnly.confidenceMean)}</strong>/5. Intention: <strong>{shown(summary.endlineOnly.intention)}</strong>/5. These are current levels, not measured gains.</> : 'There are no after-only responses in this snapshot.'}</p>
        <h4 className="font-semibold">Optional recalled ratings, shown separately</h4>
        <p className="text-sm leading-relaxed text-gray-700">{summary.counts.recalledResponses ? <>Remembered before-course ratings: n = {summary.counts.recalledResponses}. Confidence: {shown(summary.recalled.confidenceBefore)} before (recalled), {shown(summary.recalled.confidenceAfter)} now; change {signed(summary.recalled.confidenceChange)} points. Intention: {shown(summary.recalled.intentionBefore)} before (recalled), {shown(summary.recalled.intentionAfter)} now; change {signed(summary.recalled.intentionChange)} points.</> : 'No recalled ratings were submitted. They will be reported here separately from measured before-and-after results.'}</p>
      </div>
      <details className="border-t border-gray-200 pt-4"><summary className="min-h-11 cursor-pointer font-semibold">Item results and how to explain the findings</summary>
        <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[570px] text-left text-sm"><thead className="border-y border-gray-400"><tr>{['Question / item', 'Before', 'After', 'Change', 'n'].map(label => <th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead>
          <tbody>{summary.itemResults.map(item => <tr key={item.id} className="border-b border-gray-200"><th scope="row" className="p-2 font-normal">{item.label}<span className="block text-xs text-gray-500">{item.scale}</span></th>
            <td className="p-2">{shown(item.before)}</td><td className="p-2">{shown(item.after)}</td><td className="p-2">{signed(item.change)}</td><td className="p-2">{item.n}</td></tr>)}</tbody></table></div>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">{summary.notes.map(note => <li key={note}>{note}</li>)}</ul>
        <p className="mt-3 text-sm text-gray-600">Before-only learners: {summary.counts.baselineOnly}. Matched learners who changed survey language: {summary.counts.languageChangedPairs}.</p>
      </details>
      <p className="border-t border-gray-200 pt-4 text-sm leading-relaxed text-gray-700">For the presentation, use the two-page PDF with its charts and sample counts. Use Excel to inspect coded learner rows, individual questions and scoring rules. The existing SUS export measures usability and remains separate.</p>
    </>}
  </section>;
}
