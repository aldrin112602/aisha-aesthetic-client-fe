import type { UserRole } from './global';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole | string;
  shopArea?: string;
  status?: string;
}

export interface Employee extends User {
  role: 'employee' | 'Employee' | string;
  shopArea: string;
  status: string;
}
