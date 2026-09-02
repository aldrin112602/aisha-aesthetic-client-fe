import { useCallback, useEffect, useState } from 'react';

import {
  getAdminAppointments,
  getCustomerAppointments,
  getEmployeeAppointments,
} from '../../../api/appointments.api';
import type { Appointment, AppointmentScope } from '../../../types';

export function useAppointments(scope: AppointmentScope | null) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    if (!scope) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        scope.role === 'admin'
          ? await getAdminAppointments()
          : scope.role === 'customer'
            ? await getCustomerAppointments(scope.userId)
            : await getEmployeeAppointments(scope.userId);

      setAppointments(Array.isArray(data) ? data : []);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load appointments.';

      setError(message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadAppointments();
    });
  }, [loadAppointments]);

  return {
    appointments,
    error,
    loading,
    reload: loadAppointments,
    setAppointments,
  };
}
