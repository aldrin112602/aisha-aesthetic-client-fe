import { createContext, useContext } from 'react';
import type { AppNotification } from '../api/notifications.api';

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  markRead: (id?: number) => Promise<void>;
}
export const NotificationContext = createContext<NotificationState | null>(null);
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('NotificationProvider is missing.');
  return context;
}
