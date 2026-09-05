import type { CurrentUser, UserRole } from "../types/global";
import type { User } from "../types/user";

// =====================================================
// ROLE ROUTES
// =====================================================

export const roleRouteMap: Record<UserRole, string> = {
  admin: "/admin",
  employee: "/employee",
  customer: "/customer",
};

// =====================================================
// STORAGE KEYS
// =====================================================

export const STORAGE_KEY =
  import.meta.env.VITE_STORAGE_KEY || "aisha_user";

const LEGACY_STORAGE_KEY =
  "2HNC6JYg8wqRO6yNP1D8T1nFGmpTptgx";

// =====================================================
// GET CURRENT USER
// =====================================================

export function getCurrentUser(): CurrentUser | null {
  const savedUser =
    localStorage.getItem(STORAGE_KEY) ||
    localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    const user = JSON.parse(savedUser) as CurrentUser;

    // -------------------------------------------------
    // Migrate legacy storage
    // -------------------------------------------------

    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user)
      );

      localStorage.removeItem(
        LEGACY_STORAGE_KEY
      );
    }

    console.log('current user:', user)

    return user;
  } catch (error) {
    console.error(
      "Unable to read current user:",
      error
    );

    clearCurrentUser();

    return null;
  }
}

// =====================================================
// GET ROLE DESTINATION
// =====================================================

export function getRoleDestination(
  user: CurrentUser | null
): string {
  if (!user) {
    return "/signin";
  }

  return (
    roleRouteMap[user.role] ||
    "/signin"
  );
}

// =====================================================
// NORMALIZE CURRENT USER
// =====================================================

export function normalizeCurrentUser(
  user: CurrentUser | User
): CurrentUser {
  return {
    ...user,

    role: String(
      user.role
    ).toLowerCase() as UserRole,
  };
}

// =====================================================
// SAVE CURRENT USER
// =====================================================

export function saveCurrentUser(
  user: CurrentUser | User
): void {
  const normalizedUser =
    normalizeCurrentUser(user);

  // -------------------------------------------------
  // Save to the main storage key
  // -------------------------------------------------

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizedUser)
  );

  // -------------------------------------------------
  // Remove old/legacy storage
  // -------------------------------------------------

  localStorage.removeItem(
    LEGACY_STORAGE_KEY
  );

  // -------------------------------------------------
  // Tell other components that user data changed
  // -------------------------------------------------

  window.dispatchEvent(
    new Event("user-updated")
  );
}

// =====================================================
// CLEAR CURRENT USER
// =====================================================

export function clearCurrentUser(): void {
  localStorage.removeItem(
    STORAGE_KEY
  );

  localStorage.removeItem(
    LEGACY_STORAGE_KEY
  );

  // -------------------------------------------------
  // Tell other components that user was removed
  // -------------------------------------------------

  window.dispatchEvent(
    new Event("user-updated")
  );
}