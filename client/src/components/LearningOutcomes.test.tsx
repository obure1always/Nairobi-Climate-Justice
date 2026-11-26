import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LearningOutcomesSurvey, { LearningOutcomesInvite } from './LearningOutcomes';
import { CONFIDENCE_ITEMS, KNOWLEDGE_QUESTIONS, OUTCOMES_VERSION } from '../../../shared/learningOutcomes';

const session = vi.hoisted(() => ({ user: { id: 'learner-a', role: 'learner' }, token: 'token-a', language: 'en' as 'en' | 'sw', progress: {} }));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => session }));
vi.mock('../contexts/ProgressContext', () => ({ useProgress: () => ({ progress: session.progress }) }));
vi.mock('../LanguageContext', () => ({ useLanguage: () => ({ language: session.language }) }));
const status = (value = 'baseline_available', hasBaseline = false) => ({
  instrumentVersion: OUTCOMES_VERSION, status: value, hasBaseline, courseComplete: value === 'endline_available', baseline: null, endline: null
});
const renderPage = () => render(<MemoryRouter><LearningOutcomesSurvey /></MemoryRouter>);

async function answerForm() {
  fireEvent.click(screen.getByRole('checkbox', { name: 'I have read this information and freely agree to take part.' }));
  const notStarted = screen.queryByRole('checkbox', { name: 'I have not started studying lessons or taking quizzes in this course.' });
  if (notStarted) fireEvent.click(notStarted);
  fireEvent.click(screen.getByRole('button', { name: 'Start survey' }));
  for (let page = 0; page < 2; page++) {
    for (const question of KNOWLEDGE_QUESTIONS.slice(page * 4, page * 4 + 4)) fireEvent.click(screen.getByRole('radio', { name: question.options.en[0] }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  }
  for (const item of CONFIDENCE_ITEMS) {
    const group = screen.getByRole('group', { name: item.en });
    fireEvent.click(within(group).getByRole('radio', { name: '3. Moderately confident' }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  fireEvent.click(screen.getByRole('radio', { name: '4. Likely' }));
}

describe('Learning survey', () => {
  afterEach(() => {
    cleanup(); localStorage.clear(); vi.unstubAllGlobals();
    session.user = { id: 'learner-a', role: 'learner' }; session.token = 'token-a'; session.language = 'en'; session.progress = {};
  });

  it('is visible before learning and offers the correct dashboard link', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(status())));
    render(<MemoryRouter><LearningOutcomesInvite /></MemoryRouter>);
    expect((await screen.findByRole('link', { name: 'Open learning survey' })).getAttribute('href')).toBe('/learning-survey');
    expect(await screen.findByText(/Answer before starting the course/)).toBeTruthy();
  });

  it('requires consent, uses the same submission ID after failure and confirms only a saved server response', async () => {
    const bodies: Record<string, unknown>[] = [];
    vi.stubGlobal('fetch', vi.fn(async (_url, options?: RequestInit) => {
      if (options?.method === 'POST') {
        bodies.push(JSON.parse(String(options.body)));
        if (bodies.length === 1) throw new Error('Offline');
        return Response.json({ saved: true, ...status('baseline_saved', true) });
      }
      return Response.json(status());
    }));
    renderPage();
    const start = await screen.findByRole<HTMLButtonElement>('button', { name: 'Start survey' });
    expect(start.disabled).toBe(true);
    await answerForm();
    fireEvent.click(screen.getByRole('button', { name: 'Submit survey' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Your response has not been confirmed as saved');
    fireEvent.click(screen.getByRole('button', { name: 'Submit survey' }));
    expect(await screen.findByText(/Your before-course response is saved/)).toBeTruthy();
    expect(bodies).toHaveLength(2); expect(bodies[0]).toEqual(bodies[1]);
    expect(bodies[0]).toMatchObject({ phase: 'baseline', consent: true, notStarted: true, confidence: [3, 3, 3, 3], intention: 4 });
  });

  it('restores a draft only for its owner and does not prefill another learner', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(status())));
    const page = renderPage();
    await screen.findByRole('button', { name: 'Start survey' });
    fireEvent.click(screen.getByRole('checkbox', { name: 'I have read this information and freely agree to take part.' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'I have not started studying lessons or taking quizzes in this course.' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start survey' }));
    fireEvent.click(screen.getByRole('radio', { name: KNOWLEDGE_QUESTIONS[0]!.options.en[2] }));
    page.unmount(); renderPage();
    await screen.findByRole('button', { name: 'Start survey' });
    fireEvent.click(screen.getByRole('button', { name: 'Start survey' }));
    expect(screen.getByRole<HTMLInputElement>('radio', { name: KNOWLEDGE_QUESTIONS[0]!.options.en[2] }).checked).toBe(true);
    cleanup(); session.user = { id: 'learner-b', role: 'learner' }; session.token = 'token-b'; renderPage();
    await screen.findByRole('button', { name: 'Start survey' });
    expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'I have read this information and freely agree to take part.' }).checked).toBe(false);
  });

  it('does not offer a before-course response when local progress has not yet synced', async () => {
    session.progress = { m1: { ownerId: 'learner-a', completedLessons: [0] } };
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(status())));
    renderPage();
    expect(await screen.findByText(/You have already started learning/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Start survey' })).toBeNull();
  });

  it('offers recalled ratings only as an optional separate part for endline-only learners', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(status('endline_available'))));
    renderPage(); await screen.findByRole('button', { name: 'Start survey' }); await answerForm();
    expect(screen.getByRole('checkbox', { name: /Optional: I would also like to rate my confidence/ })).toBeTruthy();
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Submit survey' }).disabled).toBe(false);
    fireEvent.click(screen.getByRole('checkbox', { name: /Optional: I would also like to rate my confidence/ }));
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Submit survey' }).disabled).toBe(true);
  });

  it('provides Kiswahili wording and a retry state rather than a false availability message', async () => {
    session.language = 'sw'; const fetch = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValue(Response.json(status()));
    vi.stubGlobal('fetch', fetch); renderPage();
    const retry = await screen.findByRole('button', { name: 'Jaribu tena' }); fireEvent.click(retry);
    expect(await screen.findByRole('button', { name: 'Anza utafiti' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sera ya faragha' }).getAttribute('href')).toBe('/privacy');
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
});
