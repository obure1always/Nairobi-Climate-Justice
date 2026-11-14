import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { LanguageProvider } from '../LanguageContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, token: null, isLoading: false }),
}));

vi.mock('../contexts/ProgressContext', () => ({
  useProgress: () => ({ settings: null, isLoading: false }),
}));

afterEach(() => {
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('opens the public policy in both languages without an account', () => {
  window.history.replaceState(null, '', '/privacy');
  vi.spyOn(window, 'scrollTo').mockImplementationOnce(() => {});
  render(<LanguageProvider><App /></LanguageProvider>);

  expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Back to sign-in' }).getAttribute('href')).toBe('/login');
  expect(window.location.pathname).toBe('/privacy');

  fireEvent.click(screen.getByRole('button', { name: 'Kiswahili' }));
  const heading = screen.getByRole('heading', { level: 1, name: 'Sera ya Faragha' });
  expect(heading.closest('[lang]')?.getAttribute('lang')).toBe('sw');
  expect(document.documentElement.lang).toBe('sw');
});

it('keeps the signup language when opened in a new tab and supports switching back', () => {
  window.history.replaceState(null, '', '/privacy?lang=sw');
  vi.spyOn(window, 'scrollTo').mockImplementationOnce(() => {});
  render(<LanguageProvider><App /></LanguageProvider>);

  expect(screen.getByRole('heading', { level: 1, name: 'Sera ya Faragha' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeTruthy();
  expect(window.location.search).toBe('');
});

it('sends a guest privacy request to the support inbox and shows its saved reference', async () => {
  window.history.replaceState(null, '', '/privacy#privacy-request');
  const fetchSupport = vi.fn(async () => Response.json({
    success: true,
    ticketId: 'CJN-TICK-TEST',
    message: 'Your inquiry has been logged.',
  }, { status: 201 }));
  vi.stubGlobal('fetch', fetchSupport);

  render(<LanguageProvider><App /></LanguageProvider>);
  const form = within(screen.getByRole('region', { name: 'Privacy request' }));
  expect(form.getByRole('textbox', { name: /Contact email/ })).toHaveProperty('required', true);
  fireEvent.change(form.getByLabelText(/Your Full Name/), { target: { value: 'Test Learner' } });
  fireEvent.change(form.getByLabelText(/Contact email/), { target: { value: 'learner@example.test' } });
  fireEvent.change(form.getByLabelText(/Subject Line/), { target: { value: 'A copy of my records' } });
  fireEvent.change(form.getByLabelText(/Detailed Message/), { target: { value: 'Please send a copy of my learning records.' } });
  fireEvent.click(form.getByRole('button', { name: 'Send request' }));

  expect(await form.findByText('CJN-TICK-TEST')).toBeTruthy();
  expect(fetchSupport).toHaveBeenCalledOnce();
  expect(fetchSupport).toHaveBeenCalledWith('/api/v1/support/tickets', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Learner',
      email: 'learner@example.test',
      category: 'privacy',
      subject: 'A copy of my records',
      message: 'Please send a copy of my learning records.',
    }),
  }));
});
