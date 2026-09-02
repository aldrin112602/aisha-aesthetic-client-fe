import { apiRequest } from './client';
import type { Followup, FollowupPayload, FollowupStatus } from '../types';

export function getFollowups(customerId?: number) {
  const query = customerId ? `?customerId=${customerId}` : '';

  return apiRequest<Followup[]>(`/api/followups${query}`);
}

export function createFollowup(payload: FollowupPayload) {
  return apiRequest<Followup>('/api/followups', {
    method: 'POST',
    body: payload,
  });
}

export function updateFollowupStatus(
  followupId: number,
  status: FollowupStatus
) {
  return apiRequest<Followup>(`/api/followups/${followupId}/status`, {
    method: 'PATCH',
    body: { status },
  });
}
