import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Help from './Help';

vi.mock('../LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'learner', name: 'Amina Learner', email: null }, token: 'learner-session', isLoading: false })
}));

afterEach(() => vi.unstubAllGlobals());

it('submits an inquiry without email and displays a saved support reply after refresh', async () => {
  const inquiry = {
    id: 'CJN-TICK-SAMPLE',
    subject: 'Certificate download',
    message: 'Where can I download my earned certificate?',
    reply: null as string | null
  };
  let submitted = false;
  const mockFetch = vi.fn(async (_url: string, options?: RequestInit) => {
    expect(new Headers(options?.headers).get('Authorization')).toBe('Bearer learner-session');
    if (options?.method === 'POST') {
      expect(JSON.parse(String(options.body))).toMatchObject({ subject: inquiry.subject, message: inquiry.message, email: '' });
      submitted = true;
      return Response.json({ success: true, ticketId: inquiry.id, message: 'Your inquiry has been logged.' });
    }
    return Response.json({ tickets: submitted ? [inquiry] : [] });
  });
  vi.stubGlobal('fetch', mockFetch);
  render(<Help />);

  fireEvent.change(screen.getByLabelText('Subject Line *'), { target: { value: inquiry.subject } });
  fireEvent.change(screen.getByLabelText('Detailed Message / Description *'), { target: { value: inquiry.message } });
  fireEvent.click(screen.getByRole('button', { name: 'Submit Support Ticket' }));
  expect(await screen.findByText('Your inquiry has been logged.')).toBeTruthy();
  const history = within(screen.getByRole('region', { name: 'My Support Inquiries' }));
  expect(await history.findByText(inquiry.id)).toBeTruthy();
  expect(history.getByText('Awaiting reply')).toBeTruthy();

  inquiry.reply = 'Download the certificate from your dashboard.';
  fireEvent.click(history.getByRole('button', { name: 'Refresh inquiries' }));
  expect(await history.findByText(inquiry.reply)).toBeTruthy();
  expect(history.getByText('Replied')).toBeTruthy();
});
