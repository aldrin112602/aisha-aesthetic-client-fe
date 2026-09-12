import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiRequest, ApiError } from '../api/client';

import { getCurrentUser, getRoleDestination, saveCurrentUser, clearCurrentUser } from '../utils/auth';
import type { ProtectedRouteProps } from '../types/global';


export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const location = useLocation();
  const [session, setSession] = useState<{ path: string; user: ReturnType<typeof getCurrentUser>; error?: boolean } | null>(null);
  useEffect(() => {
    let active = true;
    let checking = false;
    let expiry: ReturnType<typeof setTimeout> | undefined;
    const expire = () => {
      if (!active) return;
      active = false;
      clearCurrentUser();
      setSession({ path: location.pathname, user: null });
    };
    const check = () => {
      if (!active || checking) return;
      if (!navigator.onLine) { setSession({ path: location.pathname, user: null, error: true }); return; }
      checking = true;
    apiRequest<{ user: NonNullable<ReturnType<typeof getCurrentUser>>; expiresAt: number; serverNow: number }>('/api/session').then(({ user, expiresAt, serverNow }) => {
      if (!active) return;
      clearTimeout(expiry);
      expiry = setTimeout(expire, Math.max(0, expiresAt - serverNow));
      saveCurrentUser(user);
      setSession({ path: location.pathname, user });
    }).catch(error => {
      if (!active) return;
      if (error instanceof ApiError && [401, 403].includes(error.status)) {
        expire();
      } else setSession({ path: location.pathname, user: null, error: true });
    }).finally(() => { checking = false; });
    };
    const storage = () => { if (!localStorage.getItem('aisha_notification_token')) expire(); else check(); };
    const visibility = () => {
      if (document.hidden) setSession(null);
      else check();
    };
    check();
    const interval = setInterval(check, 15000);
    window.addEventListener('session-expired', expire);
    window.addEventListener('storage', storage);
    window.addEventListener('focus', check);
    window.addEventListener('online', check);
    window.addEventListener('offline', check);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      active = false; clearInterval(interval); clearTimeout(expiry);
      window.removeEventListener('session-expired', expire);
      window.removeEventListener('storage', storage);
      window.removeEventListener('focus', check);
      window.removeEventListener('online', check);
      window.removeEventListener('offline', check);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [location.pathname]);
  if (!session || session.path !== location.pathname) return <p className="p-8" role="status">Checking your session...</p>;
  if (session.error) return <p className="p-8" role="alert">Unable to verify your session. Please refresh to try again.</p>;
  const currentUser = session.user;

  if (!currentUser) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <Navigate
        to={getRoleDestination(currentUser)}
        replace
      />
    );
  }

  return <>{children}</>;
}
