import { apiRequest } from './client';

import type {
  Appointment,
  AppointmentStatusUpdate,
  BookingPayload,
} from '../types';

export function getAdminAppointments() {
  return apiRequest<Appointment[]>('/api/bookings');
}

export function createBooking(payload: BookingPayload) {
  return apiRequest<Appointment>('/api/bookings', {
    method: 'POST',
    body: payload,
  });
}

export function getCustomerAppointments(customerId: number) {
  return apiRequest<Appointment[]>(
    `/api/appointments?customerId=${customerId}`
  );
}

/**
 * Gets appointments available to this employee.
 *
 * Backend will return:
 * - appointments already assigned to this employee
 * - pending unassigned appointments belonging to the employee's shop area
 */
export function getEmployeeAppointments(employeeId: number) {
  return apiRequest<Appointment[]>(
    `/api/appointments?employeeId=${employeeId}`
  );
}

/**
 * Assign an appointment to an employee and confirm it.
 */
export function assignAppointment(
  appointmentId: number,
  employeeId: number
) {
  return apiRequest<Appointment>(
    `/api/appointments/${appointmentId}/assign`,
    {
      method: 'PATCH',
      body: { employeeId },
    }
  );
}

export function updateAppointmentStatus(
  appointmentId: number,
  status: AppointmentStatusUpdate['status']
) {
  return apiRequest<Appointment>(
    `/api/appointments/${appointmentId}/status`,
    {
      method: 'PATCH',
      body: { status },
    }
  );
}

export function updateAppointment(
  appointmentId: number,
  payload: Partial<Pick<Appointment, 'date' | 'time' | 'status'>>
) {
  return apiRequest<Appointment>(
    `/api/appointments/${appointmentId}`,
    {
      method: 'PUT',
      body: payload,
    }
  );
}

export function deleteAppointmentById(appointmentId: number) {
  return apiRequest<void>(
    `/api/appointments/${appointmentId}`,
    {
      method: 'DELETE',
    }
  );
}