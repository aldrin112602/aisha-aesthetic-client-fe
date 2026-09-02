import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  X,
  XCircle,
} from 'lucide-react';

import {
  getEmployeeAppointments,
  updateAppointmentStatus as saveAppointmentStatus,
} from '../../api/appointments.api';
import type {
  Appointment,
  CurrentUser,
  DashboardAppointmentTab,
  DashboardStatusFilter,
} from '../../types';
import EmployeeAppointmentDetailsModal from './components/EmployeeAppointmentDetailsModal';
import EmployeeAppointmentList from './components/EmployeeAppointmentList';
import EmployeeStatCard from './components/EmployeeStatCard';
import {
  isUpcomingAppointment,
  parseAppointmentDate,
} from './utils/appointmentDashboard';

const getStoredEmployee = (): CurrentUser | null => {
  const savedUser = localStorage.getItem('aisha_user');

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as CurrentUser;
  } catch {
    localStorage.removeItem('aisha_user');
    return null;
  }
};

function EmployeeDashboard() {
  const currentUser = useMemo(() => getStoredEmployee(), []);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [activeTab, setActiveTab] =
    useState<DashboardAppointmentTab>('upcoming');
  const [statusFilter, setStatusFilter] =
    useState<DashboardStatusFilter>('all');
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const loadAppointments = useCallback(async () => {
    if (!currentUser?.id) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setError('');
      const data = await getEmployeeAppointments(currentUser.id);
      setAppointments(Array.isArray(data) ? data : []);
      setCurrentTime(Date.now());
    } catch (loadError) {
      console.error('Failed to load employee appointments:', loadError);
      setError('Unable to load appointments. Please try again.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadAppointments();
    });
  }, [loadAppointments]);

  const employeeAppointments = useMemo(() => {
    if (!currentUser?.id) {
      return [];
    }

    return appointments.filter(
      (appointment) => Number(appointment.employeeId) === Number(currentUser.id)
    );
  }, [appointments, currentUser]);

  const upcomingAppointments = useMemo(() => {
    return employeeAppointments
      .filter((appointment) => isUpcomingAppointment(appointment, currentTime))
      .sort((a, b) => compareAppointments(a, b, 'asc'));
  }, [currentTime, employeeAppointments]);

  const pastAppointments = useMemo(() => {
    return employeeAppointments
      .filter((appointment) => {
        if (appointment.status?.toLowerCase() === 'cancelled') {
          return true;
        }

        const appointmentDate = parseAppointmentDate(
          appointment.date,
          appointment.time
        );

        return !appointmentDate || appointmentDate.getTime() < currentTime;
      })
      .sort((a, b) => compareAppointments(a, b, 'desc'));
  }, [currentTime, employeeAppointments]);

  const activeAppointments =
    activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  const filteredAppointments = useMemo(() => {
    if (statusFilter === 'all') {
      return activeAppointments;
    }

    return activeAppointments.filter(
      (appointment) => appointment.status?.toLowerCase() === statusFilter
    );
  }, [activeAppointments, statusFilter]);

  const statusCounts = useMemo(
    () => ({
      pending: countByStatus(employeeAppointments, 'pending'),
      confirmed: countByStatus(employeeAppointments, 'confirmed'),
      cancelled: countByStatus(employeeAppointments, 'cancelled'),
    }),
    [employeeAppointments]
  );

  const updateAppointmentStatus = async (
    appointmentId: number,
    status: 'confirmed' | 'cancelled'
  ) => {
    try {
      setError('');
      await saveAppointmentStatus(appointmentId, status);
      await loadAppointments();

      setSelectedAppointment((current) =>
        current?.id === appointmentId
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (updateError) {
      console.error('Update appointment status error:', updateError);
      setError('Failed to update appointment status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
              <p className="text-sm text-gray-500">
                Loading employee dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser?.id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle size={35} className="mx-auto mb-3 text-red-500" />
            <h2 className="text-lg font-bold text-red-700">
              Employee account not found
            </h2>
            <p className="mt-1 text-sm text-red-600">
              Please login again to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-pink-500">
              Employee Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-800 md:text-3xl">
              Welcome, {currentUser.name || 'Employee'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your assigned customer appointments.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              className="ml-auto rounded-lg p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <EmployeeStatCard
            title="Upcoming"
            value={upcomingAppointments.length}
            icon={<CalendarDays size={22} />}
            active={activeTab === 'upcoming' && statusFilter === 'all'}
            onClick={() => {
              setActiveTab('upcoming');
              setStatusFilter('all');
            }}
          />
          <EmployeeStatCard
            title="Pending"
            value={statusCounts.pending}
            icon={<Clock3 size={22} />}
            active={statusFilter === 'pending'}
            onClick={() => {
              setActiveTab('upcoming');
              setStatusFilter('pending');
            }}
          />
          <EmployeeStatCard
            title="Confirmed"
            value={statusCounts.confirmed}
            icon={<CheckCircle2 size={22} />}
            active={statusFilter === 'confirmed'}
            onClick={() => {
              setActiveTab('upcoming');
              setStatusFilter('confirmed');
            }}
          />
          <EmployeeStatCard
            title="Cancelled"
            value={statusCounts.cancelled}
            icon={<XCircle size={22} />}
            active={statusFilter === 'cancelled'}
            onClick={() => {
              setActiveTab('past');
              setStatusFilter('cancelled');
            }}
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  My Appointments
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredAppointments.length} appointment
                  {filteredAppointments.length !== 1 ? 's' : ''}
                </p>
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as DashboardStatusFilter)
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mt-5 flex gap-2 rounded-xl bg-gray-100 p-1">
              <TabButton
                active={activeTab === 'upcoming'}
                count={upcomingAppointments.length}
                label="Upcoming"
                onClick={() => {
                  setActiveTab('upcoming');
                  setStatusFilter('all');
                }}
              />
              <TabButton
                active={activeTab === 'past'}
                count={pastAppointments.length}
                label="Past"
                onClick={() => {
                  setActiveTab('past');
                  setStatusFilter('all');
                }}
              />
            </div>
          </div>

          <EmployeeAppointmentList
            appointments={filteredAppointments}
            onSelectAppointment={setSelectedAppointment}
          />
        </div>
      </div>

      {selectedAppointment && (
        <EmployeeAppointmentDetailsModal
          activeTab={activeTab}
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdateStatus={updateAppointmentStatus}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        active ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'
      }`}
    >
      {label}
      <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
        {count}
      </span>
    </button>
  );
}

function compareAppointments(
  a: Appointment,
  b: Appointment,
  direction: 'asc' | 'desc'
) {
  const dateA = parseAppointmentDate(a.date, a.time);
  const dateB = parseAppointmentDate(b.date, b.time);

  if (!dateA || !dateB) {
    return 0;
  }

  return direction === 'asc'
    ? dateA.getTime() - dateB.getTime()
    : dateB.getTime() - dateA.getTime();
}

function countByStatus(appointments: Appointment[], status: string) {
  return appointments.filter(
    (appointment) => appointment.status?.toLowerCase() === status
  ).length;
}

export default EmployeeDashboard;
