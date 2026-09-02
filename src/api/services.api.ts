import { apiRequest } from './client';
import type { Service, ServicePayload } from '../types';

export function getServices() {
  return apiRequest<Service[]>('/api/services');
}

export function createService(payload: ServicePayload) {
  return apiRequest<Service>('/api/services', {
    method: 'POST',
    body: payload,
  });
}

export function updateService(id: number, payload: Partial<ServicePayload>) {
  return apiRequest<Service>(`/api/services/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteService(id: number) {
  return apiRequest<void>(`/api/services/${id}`, {
    method: 'DELETE',
  });
}
