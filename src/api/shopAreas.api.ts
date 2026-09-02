import { apiRequest } from './client';
import type { ShopArea, ShopAreaPayload } from '../types';

export function getShopAreas() {
  return apiRequest<ShopArea[]>('/api/shop-areas');
}

export function createShopArea(payload: ShopAreaPayload) {
  return apiRequest<ShopArea>('/api/shop-areas', {
    method: 'POST',
    body: payload,
  });
}

export function updateShopArea(id: number, payload: Partial<ShopAreaPayload>) {
  return apiRequest<ShopArea>(`/api/shop-areas/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteShopArea(id: number) {
  return apiRequest<void>(`/api/shop-areas/${id}`, {
    method: 'DELETE',
  });
}
