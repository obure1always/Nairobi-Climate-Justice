import { apiUrl } from './api';

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
}

export async function supportRequest<T>(path: string, token: string | null, request?: RequestInit): Promise<T> {
  const headers = new Headers(request?.headers);
  if (token) headers.set('Authorization', 'Bearer ' + token);
  if (request?.body) headers.set('Content-Type', 'application/json');
  const response = await fetch(apiUrl(path), { ...request, headers });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.error || 'Could not reach the support desk. Please try again.');
  }
  return result;
}
