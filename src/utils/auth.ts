import type { CurrentUser, UserRole } from '../types/global';

export const roleRouteMap: Record<UserRole, string> = {
  admin: '/admin',
  employee: '/employee',
  customer: '/customer',
};
const STORAGE_KEY = 'aisha_user';
export function getCurrentUser(): CurrentUser | null {
  const savedUser = localStorage.getItem(STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as CurrentUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function getRoleDestination(user: CurrentUser | null): string {
  if (!user) return '/signin';
  return roleRouteMap[user.role] || '/signin';
}