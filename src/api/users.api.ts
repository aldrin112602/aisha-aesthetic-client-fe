import { apiRequest } from './client';
import type { Employee, User } from '../types';

export interface EmployeePayload {
  name: string;
  email: string;
  password?: string;
  role: string;
  shopArea: string;
}

export function getUsers(role?: string) {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';

  return apiRequest<User[]>(`/api/users${query}`);
}

export function getEmployees() {
  return apiRequest<Employee[]>('/api/users?role=Employee');
}

export function createUser(payload: EmployeePayload) {
  return apiRequest<User>('/api/users', {
    method: 'POST',
    body: payload,
  });
}

export function updateUser(id: number, payload: Partial<EmployeePayload>) {
  return apiRequest<User>(`/api/users/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteUser(id: number) {
  return apiRequest<void>(`/api/users/${id}`, {
    method: 'DELETE',
  });
}
