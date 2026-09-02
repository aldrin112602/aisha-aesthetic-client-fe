export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role?: string;
  profileImage?: string;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
