import type { Appointment } from '../../../types';

export const parseAppointmentDate = (
  date: string,
  time: string
): Date | null => {
  if (!date || !time) {
    return null;
  }

  const rawTime = String(time).trim().toUpperCase();
  const amPmMatch = rawTime.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/
  );

  if (amPmMatch) {
    let hour = Number(amPmMatch[1]);
    const minute = Number(amPmMatch[2]);
    const second = Number(amPmMatch[3] || 0);
    const period = amPmMatch[4];

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    }

    if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const result = new Date(
      `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(
        2,
        '0'
      )}:${String(second).padStart(2, '0')}`
    );

    return Number.isNaN(result.getTime()) ? null : result;
  }

  const twentyFourHourMatch = rawTime.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
  );

  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = Number(twentyFourHourMatch[2]);
    const second = Number(twentyFourHourMatch[3] || 0);

    const result = new Date(
      `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(
        2,
        '0'
      )}:${String(second).padStart(2, '0')}`
    );

    return Number.isNaN(result.getTime()) ? null : result;
  }

  const fallback = new Date(`${date} ${time}`);

  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

export const isUpcomingAppointment = (
  appointment: Appointment,
  referenceTime = Date.now()
): boolean => {
  if (appointment.status?.toLowerCase() === 'cancelled') {
    return false;
  }

  const appointmentDate = parseAppointmentDate(
    appointment.date,
    appointment.time
  );

  return Boolean(appointmentDate && appointmentDate.getTime() >= referenceTime);
};

export const formatAppointmentDate = (date: string) => {
  if (!date) {
    return 'N/A';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatPeso = (price: number) =>
  `₱${Number(price || 0).toLocaleString()}`;
