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
    apiRequest<{ user: NonNullable<ReturnType<typeof getCurrentUser>> }>('/api/session').then(({ user }) => {
      if (!active) return;
      saveCurrentUser(user);
      setSession({ path: location.pathname, user });
    }).catch(error => {
      if (!active) return;
      if (error instanceof ApiError && [401, 403].includes(error.status)) {
        clearCurrentUser();
        setSession({ path: location.pathname, user: null });
      } else setSession({ path: location.pathname, user: null, error: true });
    });
    return () => { active = false; };
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
