import { apiRequest } from './client';
import type {
  Employee,
  EmployeePayload,
} from '../types';

/**
 * Get ALL accounts
 * Admin / Employee / Customer
 */
export function getUsers() {
  return apiRequest<Employee[]>('/api/users');
}

/**
 * Get employees only
 */
export function getEmployees() {
  return apiRequest<Employee[]>(
    '/api/users?role=employee'
  );
}

/**
 * Create account
 */
export function createUser(
  payload: EmployeePayload
) {
  return apiRequest<Employee>(
    '/api/users',
    {
      method: 'POST',
      body: payload,
    }
  );
}

/**
 * Update account
 */
export function updateUser(
  id: number,
  payload: Partial<EmployeePayload>
) {
  return apiRequest<Employee>(
    `/api/users/${id}`,
    {
      method: 'PUT',
      body: payload,
    }
  );
}

/**
 * Delete account
 */
export function deleteUser(
  id: number
) {
  return apiRequest<void>(
    `/api/users/${id}`,
    {
      method: 'DELETE',
    }
  );
}