export type UserRole = 'admin' | 'employee' | 'customer';
 
export interface CurrentUser {
  role: UserRole;
  [key: string]: unknown;
}

export interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

