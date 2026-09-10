import type { Appointment } from '../types';

export function appointmentTime(date: string, time: string): number {
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i.exec((time || '').trim());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !match) return NaN;
  let hour = Number(match[1]);
  if (Number(match[2]) > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23)) return NaN;
  if (match[3]) hour = hour % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  const result = Date.parse(`${date}T${String(hour).padStart(2, '0')}:${match[2]}:00+08:00`);
  return Number.isFinite(result) && new Date(result + 8 * 3600000).toISOString().slice(0, 10) === date ? result : NaN;
}

export function customerHistory(appointments: Appointment[], customerId: number, now: number) {
  return appointments.filter(appointment => {
    if (Number(appointment.customerId) !== customerId) return false;
    const status = appointment.status.trim().toLowerCase();
    return ['completed', 'cancelled', 'no-show'].includes(status) || appointmentTime(appointment.date, appointment.time) < now;
  }).sort((a, b) => {
    const first = appointmentTime(a.date, a.time);
    const second = appointmentTime(b.date, b.time);
    return (Number.isFinite(second) ? second : 0) - (Number.isFinite(first) ? first : 0) || b.id - a.id;
  });
}
