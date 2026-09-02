import { apiRequest } from './client';
import type { LoginCredentials, SignupPayload, User } from '../types';

export function login(credentials: LoginCredentials) {
  return apiRequest<User>('/api/login', {
    method: 'POST',
    body: credentials,
  });
}

export function signup(payload: SignupPayload) {
  return apiRequest<User>('/api/signup', {
    method: 'POST',
    body: payload,
  });
}
