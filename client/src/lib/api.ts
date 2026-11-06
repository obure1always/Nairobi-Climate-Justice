const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

export const API_BASE = configuredApiBase
  ? configuredApiBase.endsWith('/api/v1')
    ? configuredApiBase
    : `${configuredApiBase}/api/v1`
  : '/api/v1';

export const apiUrl = (path: string) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
