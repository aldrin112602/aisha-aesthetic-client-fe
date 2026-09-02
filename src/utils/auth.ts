import type { CurrentUser, UserRole } from '../types/global';
import type { User } from '../types/user';

export const roleRouteMap: Record<UserRole, string> = {
  admin: '/admin',
  employee: '/employee',
  customer: '/customer',
};

export const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'aisha_user';
const LEGACY_STORAGE_KEY = '2HNC6JYg8wqRO6yNP1D8T1nFGmpTptgx';

export function getCurrentUser(): CurrentUser | null {
  const savedUser =
    localStorage.getItem(STORAGE_KEY) ||
    localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    const user = JSON.parse(savedUser) as CurrentUser;

    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    return user;
  } catch {
    clearCurrentUser();
    return null;
  }
}

export function getRoleDestination(user: CurrentUser | null): string {
  if (!user) return '/signin';
  return roleRouteMap[user.role] || '/signin';
}

export function normalizeCurrentUser(user: CurrentUser | User): CurrentUser {
  return {
    ...user,
    role: String(user.role).toLowerCase() as UserRole,
  };
}

export function saveCurrentUser(user: CurrentUser | User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCurrentUser(user)));
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}
