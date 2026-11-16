import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CourseUsabilityInvite, CourseUsabilitySurvey } from './CourseUsability';

vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ token: 'test-token', user: { id: 'test-learner' } }) }));
vi.mock('../LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

describe('Course usability survey', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('offers the invitation once course completion is confirmed', async () => {
    let status = 'locked';
    const fetch = vi.fn(async () => Response.json({ status }));
    vi.stubGlobal('fetch', fetch);
    render(<MemoryRouter><CourseUsabilityInvite /></MemoryRouter>);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('link', { name: /share feedback/i })).toBeNull();

    status = 'available';
    fireEvent(window, new Event('climate-justice-data-changed'));
    const invitation = await screen.findByRole('link', { name: 'Share feedback (optional)' });
    expect(invitation.getAttribute('href')).toBe('/assessment?type=sus');
  });

  it('keeps ratings after a failed connection and thanks the learner after the server saves them', async () => {
    const bodies: unknown[] = [];
    vi.stubGlobal('fetch', vi.fn(async (_input, options?: RequestInit) => {
      if (options?.method !== 'POST') return Response.json({ status: 'available' });
      bodies.push(JSON.parse(String(options.body)));
      if (bodies.length === 1) throw new Error('Connection interrupted');
      return Response.json({ status: 'submitted' });
    }));

    render(<MemoryRouter><CourseUsabilitySurvey /></MemoryRouter>);
    const questions = await screen.findAllByRole('group');
    expect(questions).toHaveLength(10);
    expect(screen.getByRole('link', { name: 'Skip for now' }).getAttribute('href')).toBe('/dashboard');
    const submit = screen.getByRole<HTMLButtonElement>('button', { name: 'Submit feedback' });
    expect(submit.disabled).toBe(true);
    for (const question of questions) fireEvent.click(within(question).getByRole('radio', { name: '3' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Finding the next module' } });

    fireEvent.click(submit);
    expect((await screen.findByRole('alert')).textContent).toContain('Your answers are still here.');
    expect(within(questions[0]!).getByRole<HTMLInputElement>('radio', { name: '3' }).checked).toBe(true);
    fireEvent.click(submit);
    expect(await screen.findByText('Thank you for sharing your feedback.')).toBeTruthy();
    const expected = { answers: questions.map(() => 3), language: 'en', comment: 'Finding the next module' };
    expect(bodies).toEqual([expected, expected]);
  });
});
