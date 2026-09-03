import { apiRequest } from './client';

import type { Service, ServicePayload } from '../types';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function getServices() {
  return apiRequest<Service[]>('/api/services');
}

export function createService(payload: ServicePayload) {
  return apiRequest<Service>('/api/services', {
    method: 'POST',
    body: payload,
  });
}

export function updateService(
  id: number,
  payload: Partial<ServicePayload>
) {
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

export async function uploadServiceImage(file: File) {
  const formData = new FormData();

  formData.append('image', file);

  const response = await fetch(
    `${apiBaseUrl}/api/services/upload-image`,
    {
      method: 'POST',
      body: formData,
    }
  );

  let data: {
    image?: string;
    message?: string;
  } = {};

  try {
    data = await response.json();
  } catch {
    // Ignore JSON parsing error
  }

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to upload service image.'
    );
  }

  if (!data.image) {
    throw new Error('Image upload succeeded but no image path was returned.');
  }

  return {
    image: data.image,
    message: data.message || 'Image uploaded successfully.',
  };
}