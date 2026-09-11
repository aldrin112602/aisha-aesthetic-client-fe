import { apiRequest } from './client';

export function getNextSessions(id: number) {
  return apiRequest<Appointment[]>(`/api/appointments/${id}/next-sessions`);
}

export async function createNextSession(id: number, payload: {
  date: string; time: string; serviceId: number; employeeId: number | null; notes: string;
}) {
  const appointment = await apiRequest<Appointment>(`/api/appointments/${id}/next-sessions`, { method: 'POST', body: payload });
  window.dispatchEvent(new Event('notifications-updated'));
  return appointment;
}

import type {
  Appointment,
  AppointmentStatusHistoryEntry,
  AppointmentStatusUpdate,
  BookingPayload,
} from '../types';


export function getAdminAppointments(params?: {
  status?: string;
  type?: string;
}) {
  const query = new URLSearchParams();

  if (params?.status) {
    query.set('status', params.status);
  }

  if (params?.type) {
    query.set('type', params.type);
  }

  const queryString = query.toString();

  return apiRequest<Appointment[]>(
    `/api/appointments${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Create a new customer booking.
 */
export async function createBooking(payload: BookingPayload) {
  const appointment = await apiRequest<Appointment>('/api/bookings', {
    method: 'POST',
    body: payload,
  });
  window.dispatchEvent(new Event('notifications-updated'));
  return appointment;
}

/**
 * Get all appointments for a specific customer.
 */
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
 * `changedBy` is the id of the user (admin or employee) making the
 * change, used server-side to write a mini audit trail entry.
 */
export function updateAppointmentStatus(
  appointmentId: number,
  status: AppointmentStatusUpdate['status'],
  isAdmin: boolean = false,
  changedBy?: number
) {
  return apiRequest<Appointment>(
    `/api/appointments/${appointmentId}/status`,
    {
      method: 'PATCH',
      body: {
        status,
        isAdmin,
        changedBy,
      },
    }
  );
}

/**
 * Get the status-change audit trail for an appointment.
 * Admin-only surface.
 */
export function getAppointmentStatusHistory(appointmentId: number) {
  return apiRequest<AppointmentStatusHistoryEntry[]>(
    `/api/appointments/${appointmentId}/history`
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
