import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getNotifications, markNotificationRead } from '../api/notifications.api';
import type { AppNotification } from '../api/notifications.api';
import { NotificationContext } from '../hooks/useNotifications';
import { getCurrentUser } from '../utils/auth';

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const requestVersion = useRef(0);

  const refresh = useCallback(async () => {
    const accountVersion = generation.current;
    const version = ++requestVersion.current;
    if (!getCurrentUser()?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setError('');
      setLoading(false);
      return;
    }
    try {
      const data = await getNotifications();
      if (accountVersion !== generation.current || version !== requestVersion.current) return;
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setError('');
    } catch (reason) {
      if (accountVersion !== generation.current || version !== requestVersion.current) return;
      setError(reason instanceof Error ? reason.message : 'Unable to load notifications.');
    } finally {
      if (accountVersion === generation.current && version === requestVersion.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const invalidate = () => { generation.current++; };
    const accountChanged = () => {
      invalidate();
      setNotifications([]);
      setUnreadCount(0);
      setLoading(true);
      void refresh();
    };
    const reload = () => { void refresh(); };
    const initialLoad = window.setTimeout(reload, 0);
    const timer = window.setInterval(reload, 15000);
    window.addEventListener('user-updated', accountChanged);
    window.addEventListener('storage', accountChanged);
    window.addEventListener('focus', reload);
    window.addEventListener('notifications-updated', reload);
    return () => {
      invalidate();
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
      window.removeEventListener('user-updated', accountChanged);
      window.removeEventListener('storage', accountChanged);
      window.removeEventListener('focus', reload);
      window.removeEventListener('notifications-updated', reload);
    };
  }, [refresh]);

  const markRead = async (id?: number) => {
    await markNotificationRead(id);
    await refresh();
  };
  return <NotificationContext.Provider value={{ notifications, unreadCount, loading, error, refresh, markRead }}>
    {children}
  </NotificationContext.Provider>;
}
