import type { ReactNode } from 'react';

import type { Appointment } from './appointment';

export type DashboardAppointmentTab = 'upcoming' | 'past';

export type DashboardStatusFilter =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'cancelled';

export interface DashboardStat {
  title: string;
  value: number;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface EmployeeAppointmentListProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

export interface EmployeeAppointmentDetailsModalProps {
  activeTab: DashboardAppointmentTab;
  appointment: Appointment;
  onClose: () => void;
  onUpdateStatus: (
    appointmentId: number,
    status: 'confirmed' | 'cancelled'
  ) => void;
}

export interface EmployeeStatusBadgeProps {
  status: string;
}

export interface DashboardIconSectionProps {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}

export interface DashboardFieldProps {
  label: string;
  value: string;
}

export interface DashboardMobileDetailProps {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}
