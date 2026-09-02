import { Navigate } from 'react-router-dom';
import { getCurrentUser, getRoleDestination } from '../utils/auth';

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = getCurrentUser();
  
  if (currentUser) {
    return (
      <Navigate
        to={getRoleDestination(currentUser)}
        replace
      />
    );
  }

  return <>{children}</>;
}