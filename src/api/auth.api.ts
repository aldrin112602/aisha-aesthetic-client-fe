import { apiRequest } from './client';
import type { LoginCredentials, SignupPayload, User } from '../types';

export interface AuthResponse {
  user: User;
}

export function login(credentials: LoginCredentials) {
  return apiRequest<AuthResponse>('/api/login', {
    method: 'POST',
    body: credentials,
  });
}

export function signup(payload: SignupPayload) {
  return apiRequest<AuthResponse>('/api/signup', {
    method: 'POST',
    body: payload,
  });
}
