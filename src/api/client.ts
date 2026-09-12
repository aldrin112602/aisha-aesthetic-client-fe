import type { RequestOptions } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function authFetch(input: RequestInfo | URL, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem('aisha_notification_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(input, { ...options, headers, cache: 'no-store' });
  if (token && token === localStorage.getItem('aisha_notification_token')) {
    if (response.status === 401) window.dispatchEvent(new Event('session-expired'));
    else if (response.status === 403) {
      const data = await response.clone().json().catch(() => null);
      if (data?.code === 'EMPLOYEE_ACCESS_DENIED') window.dispatchEvent(new Event('session-expired'));
    }
  }
  return response;
}

export function revokeSession() {
  if (localStorage.getItem('aisha_notification_token')) {
    void authFetch(`${API_BASE_URL}/api/logout`, { method: 'POST', keepalive: true }).catch(() => {});
  }
  localStorage.removeItem('aisha_notification_token');
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const hasJson = contentType?.includes('application/json');
  const data = hasJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String(data.message)
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return data as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await authFetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body),
  });

  return parseResponse<T>(response);
}

export { API_BASE_URL };
