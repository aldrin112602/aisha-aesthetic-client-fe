import { apiRequest } from './client';

export interface AppNotification {
  id: number;
  appointmentId: number;
  kind: 'booking' | 'reminder' | 'next-session';
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
}
function headers() {
  return { Authorization: `Bearer ${localStorage.getItem('aisha_notification_token') || ''}` };
}
export function getNotifications() {
  return apiRequest<{ notifications: AppNotification[]; unreadCount: number }>('/api/notifications', { headers: headers() });
}
export function markNotificationRead(id?: number) {
  return apiRequest(`/api/notifications/${id === undefined ? 'read-all' : `${id}/read`}`, {
    method: 'PATCH', headers: headers(),
  });
}
