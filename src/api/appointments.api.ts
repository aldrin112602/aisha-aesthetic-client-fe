import { apiRequest } from './client';

import type {
  Appointment,
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