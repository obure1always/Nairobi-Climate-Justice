import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminLearningOutcomes from './AdminLearningOutcomes';
import { OUTCOMES_VERSION, type OutcomeSummary } from '../../../shared/learningOutcomes';

const empty: OutcomeSummary = {
  instrumentVersion: OUTCOMES_VERSION, generatedAt: '2026-11-26T00:00:00Z',
  counts: { learnersResponded: 0, baselineResponses: 0, endlineResponses: 0, matchedPairs: 0, baselineOnly: 0, endlineOnly: 0, languageChangedPairs: 0, recalledResponses: 0 },
  metrics: [
    { id: 'knowledge', label: 'Climate knowledge', scale: '0–100%', before: null, after: null, change: null, n: 0 },
    { id: 'justice', label: 'Climate justice', scale: '0–100%', before: null, after: null, change: null, n: 0 },
    { id: 'confidence', label: 'Confidence to act', scale: '1–5', before: null, after: null, change: null, n: 0 },
    { id: 'intention', label: 'Intention', scale: '1–5', before: null, after: null, change: null, n: 0 }
  ], knowledgeChange: { improved: 0, unchanged: 0, lower: 0 },
  endlineOnly: { knowledgePercent: null, confidenceMean: null, intention: null },
  recalled: { confidenceBefore: null, confidenceAfter: null, confidenceChange: null, intentionBefore: null, intentionAfter: null, intentionChange: null },
  itemResults: [], notes: []
};
describe('Admin learning outcome reports', () => {
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
  it('labels empty results honestly and provides both presentation and Excel exports', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(empty)));
    render(<AdminLearningOutcomes token="admin-token" />);
    expect(await screen.findByText(/No matched results yet/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Export learning results to Excel' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download presentation summary (PDF)' })).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });
  it('does not download a login or API error as a PDF', async () => {
    const fetch = vi.fn(async (url: string) => url.endsWith('.pdf') ? Response.json({ error: 'Expired session' }, { status: 401 }) : Response.json(empty));
    vi.stubGlobal('fetch', fetch); render(<AdminLearningOutcomes token="admin-token" />);
    await screen.findByText(/No matched results yet/);
    fireEvent.click(screen.getByRole('button', { name: 'Download presentation summary (PDF)' }));
    expect((await screen.findByRole('alert')).textContent).toContain('The PDF report could not be downloaded');
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/admin/export/learning-outcomes.pdf'), expect.objectContaining({ headers: { Authorization: 'Bearer admin-token' } })));
  });
});
