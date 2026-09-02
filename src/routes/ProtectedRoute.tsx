import { Navigate, useLocation } from 'react-router-dom';

import { getCurrentUser, getRoleDestination } from '../utils/auth';
import type { ProtectedRouteProps } from '../types/global';


export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const location = useLocation();
  const currentUser = getCurrentUser();

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