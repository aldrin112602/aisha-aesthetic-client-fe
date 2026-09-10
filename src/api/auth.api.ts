import { apiRequest } from './client';
import type { AuthResponse, LoginCredentials, SignupPayload } from '../types';

export interface StaffTermsChallenge {
  termsRequired: true;
  termsToken: string;
  role: 'admin' | 'employee';
  version: string;
  title: string;
  sections: { title: string; text: string }[];
}
type SignedInResponse = AuthResponse & { notificationToken: string; termsRequired?: false };

export async function login(credentials: LoginCredentials) {
  const response = await apiRequest<SignedInResponse | StaffTermsChallenge>('/api/login', {
    method: 'POST',
    body: credentials,
  });
  if (!response.termsRequired) localStorage.setItem('aisha_notification_token', response.notificationToken);
  return response;
}

export async function acceptStaffTerms(challenge: StaffTermsChallenge) {
  const response = await apiRequest<SignedInResponse>('/api/staff-terms/accept', {
    method: 'POST', body: { termsToken: challenge.termsToken, version: challenge.version, accepted: true },
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

export interface CustomerTerms {
  version: string;
  title: string;
  sections: { title: string; text: string }[];
}
export function getCustomerTerms() {
  return apiRequest<CustomerTerms>('/api/customer-terms');
}
