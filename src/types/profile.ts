export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role?: string;
  profileImage?: string;
  type?: string;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
