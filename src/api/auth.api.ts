import { apiRequest } from './client';
import type { AuthResponse, LoginCredentials, SignupPayload } from '../types';

export async function login(credentials: LoginCredentials) {
  const response = await apiRequest<AuthResponse & { notificationToken: string }>('/api/login', {
    method: 'POST',
    body: credentials,
  });
  localStorage.setItem('aisha_notification_token', response.notificationToken);
  return response;
}

export function signup(payload: SignupPayload) {
  return apiRequest<AuthResponse>('/api/signup', {
    method: 'POST',
    body: payload,
  });
}
