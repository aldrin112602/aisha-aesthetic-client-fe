import { apiRequest } from './client';

import type {
  Appointment,
  AppointmentStatusUpdate,
  BookingPayload,
} from '../types';

/**
 * Get all appointments for Admin.
 *
 * IMPORTANT:
 * Use /api/appointments instead of /api/bookings
 * because /api/appointments includes:
 * - customerName
 * - customerEmail
 * - employeeName
 */
export function getAdminAppointments() {
  return apiRequest<Appointment[]>('/api/appointments');
}

/**
 * Create a new customer booking.
 */
export function createBooking(payload: BookingPayload) {
  return apiRequest<Appointment>('/api/bookings', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Get all appointments for a specific customer.
 */
export function getCustomerAppointments(customerId: number) {
  return apiRequest<Appointment[]>(
    `/api/appointments?customerId=${customerId}`
  );
}

/**
 * Get appointments available to this employee.
 *
 * Backend returns:
 * - appointments already assigned to this employee
 * - pending unassigned appointments belonging
 *   to the employee's shop area
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
      body: {
        employeeId,
      },
    }
  );
}

/**
 * Update appointment status.
 */
export function updateAppointmentStatus(
  appointmentId: number,
  status: AppointmentStatusUpdate['status']
) {
  return apiRequest<Appointment>(
    `/api/appointments/${appointmentId}/status`,
    {
      method: 'PATCH',
      body: {
        status,
      },
    }
  );
}

/**
 * Update appointment details.
 *
 * Currently supports:
 * - date
 * - time
 * - status
 */
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

/**
 * Delete an appointment.
 */
export function deleteAppointmentById(appointmentId: number) {
  return apiRequest<void>(
    `/api/appointments/${appointmentId}`,
    {
      method: 'DELETE',
    }
  );
}