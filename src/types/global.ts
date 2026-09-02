export type UserRole = 'admin' | 'employee' | 'customer';
 
export interface CurrentUser {
  id?: number;
  name?: string;
  email?: string;
  role: UserRole;
  shopArea?: string | null;
  [key: string]: unknown;
}

export interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

