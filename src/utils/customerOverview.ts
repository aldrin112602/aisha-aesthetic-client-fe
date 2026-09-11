import type { Appointment } from '../types/appointment';
import { appointmentTime } from './appointmentHistory.ts';

export function customerOverview(appointments: Appointment[], customerId: number, now: number) {
  const own = appointments.filter(a => Number(a.customerId) === customerId);
  const upcoming = own.filter(a => ['pending', 'confirmed'].includes(a.status.trim().toLowerCase()) && appointmentTime(a.date, a.time) >= now)
    .sort((a, b) => appointmentTime(a.date, a.time) - appointmentTime(b.date, b.time));
  const completed = own.filter(a => a.status.trim().toLowerCase() === 'completed');
  const recent = [...own].sort((a, b) => (Date.parse(b.createdAt || '') || appointmentTime(b.date, b.time) || 0) - (Date.parse(a.createdAt || '') || appointmentTime(a.date, a.time) || 0));
  return { upcoming, completed, followups: upcoming.filter(a => !!a.previousAppointmentId), recent };
}
