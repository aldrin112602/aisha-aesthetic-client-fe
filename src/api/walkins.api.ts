import { apiRequest } from './client';
import type { WalkinPayload, WalkinRecord } from '../types';

export function getWalkins() {
  return apiRequest<WalkinRecord[]>('/api/walkins');
}

export function createWalkin(payload: WalkinPayload) {
  return apiRequest<WalkinRecord>('/api/walkins', {
    method: 'POST',
    body: payload,
  });
}
