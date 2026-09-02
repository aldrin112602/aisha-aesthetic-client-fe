import { apiRequest } from './client';
import type { Appointment, AppointmentStatusUpdate } from '../types';

export function getAdminAppointments() {
  return apiRequest<Appointment[]>('/api/bookings');
}

export function getCustomerAppointments(customerId: number) {
  return apiRequest<Appointment[]>(
    `/api/appointments?customerId=${customerId}`
  );
}

export function getEmployeeAppointments(employeeId: number) {
  return apiRequest<Appointment[]>(
    `/api/appointments?employeeId=${employeeId}`
  );
}

export function updateAppointmentStatus(
  appointmentId: number,
  status: AppointmentStatusUpdate['status']
) {
  return apiRequest<Appointment>(`/api/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export function deleteAppointmentById(appointmentId: number) {
  return apiRequest<void>(`/api/appointments/${appointmentId}`, {
    method: 'DELETE',
  });
}
