import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  UserCheck,
  MapPin,
  User,
  Mail,
  Scissors,
  PhilippinePeso,
  Eye,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';

interface EmployeeAppointment {
  id: number;

  // Customer
  customerId: number;
  customerName: string | null;
  customerEmail: string | null;
  customerShopArea: string | null;

  // Assigned Employee
  employeeId: number | null;
  employeeName: string | null;
  employeeEmail: string | null;
  employeeShopArea: string | null;

  // Appointment
  serviceId: number;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  area: string;
  price: number;
  status: string;
  notes?: string | null;
  createdAt?: string;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  shopArea?: string | null;
}

type StatusFilter =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'cancelled';

type AppointmentTab = 'upcoming' | 'past';

// =====================================================
// HELPERS
// =====================================================

const getCurrentUser = (): CurrentUser | null => {
  const savedUser = localStorage.getItem('aisha_user');

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('aisha_user');
    return null;
  }
};

/**
 * Converts appointment date + time into a JavaScript Date.
 *
 * Supports:
 *  - 2026-09-05 + 10:30
 *  - 2026-09-05 + 10:30:00
 *  - 2026-09-05 + 10:30 AM
 *  - 2026-09-05 + 10:30 PM
 */
const parseAppointmentDate = (
  date: string,
  time: string
): Date | null => {
  if (!date || !time) {
    return null;
  }

  const rawTime = String(time).trim().toUpperCase();

  // AM / PM format
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
      `${date}T${String(hour).padStart(2, '0')}:${String(
        minute
      ).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    );

    return Number.isNaN(result.getTime()) ? null : result;
  }

  // 24-hour format
  const twentyFourHourMatch = rawTime.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
  );

  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = Number(twentyFourHourMatch[2]);
    const second = Number(twentyFourHourMatch[3] || 0);

    const result = new Date(
      `${date}T${String(hour).padStart(2, '0')}:${String(
        minute
      ).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    );

    return Number.isNaN(result.getTime()) ? null : result;
  }

  // Last fallback
  const fallback = new Date(`${date} ${time}`);

  return Number.isNaN(fallback.getTime())
    ? null
    : fallback;
};

const isUpcomingAppointment = (
  appointment: EmployeeAppointment
): boolean => {
  // Cancelled appointments should never appear in Upcoming.
  if (appointment.status?.toLowerCase() === 'cancelled') {
    return false;
  }

  const appointmentDate = parseAppointmentDate(
    appointment.date,
    appointment.time
  );

  if (!appointmentDate) {
    return false;
  }

  return appointmentDate.getTime() >= Date.now();
};

// =====================================================
// COMPONENT
// =====================================================

function EmployeeDashboard() {
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3001';

  const currentUser = useMemo(
    () => getCurrentUser(),
    []
  );

  const [appointments, setAppointments] = useState<
    EmployeeAppointment[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] =
    useState<AppointmentTab>('upcoming');

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all');

  const [selectedAppointment, setSelectedAppointment] =
    useState<EmployeeAppointment | null>(null);

  // ===================================================
  // LOAD EMPLOYEE APPOINTMENTS
  // ===================================================

  const loadAppointments = useCallback(async () => {
    if (!currentUser) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setError('');

      /**
       * IMPORTANT:
       *
       * Only fetch appointments assigned to the
       * currently logged-in employee.
       */
      const response = await fetch(
        `${apiBaseUrl}/api/appointments?employeeId=${currentUser.id}`
      );

      if (!response.ok) {
        throw new Error(
          'Failed to fetch employee appointments.'
        );
      }

      const data = await response.json();

      setAppointments(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        'Failed to load employee appointments:',
        err
      );

      setError(
        'Unable to load appointments. Please try again.'
      );

      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiBaseUrl, currentUser]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
  };

  // ===================================================
  // EMPLOYEE APPOINTMENTS
  // ===================================================

  /**
   * Backend already filters using employeeId.
   *
   * We still perform a client-side safety filter
   * to guarantee that another employee's appointment
   * cannot appear.
   */
  const employeeAppointments = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return appointments.filter(
      (appointment) =>
        Number(appointment.employeeId) ===
        Number(currentUser.id)
    );
  }, [appointments, currentUser]);

  // ===================================================
  // UPCOMING / PAST
  // ===================================================

  const upcomingAppointments = useMemo(() => {
    return employeeAppointments
      .filter((appointment) =>
        isUpcomingAppointment(appointment)
      )
      .sort((a, b) => {
        const dateA = parseAppointmentDate(
          a.date,
          a.time
        );

        const dateB = parseAppointmentDate(
          b.date,
          b.time
        );

        if (!dateA || !dateB) {
          return 0;
        }

        return (
          dateA.getTime() - dateB.getTime()
        );
      });
  }, [employeeAppointments]);

  const pastAppointments = useMemo(() => {
    return employeeAppointments
      .filter((appointment) => {
        // Cancelled appointments are considered past/history
        if (
          appointment.status?.toLowerCase() ===
          'cancelled'
        ) {
          return true;
        }

        const appointmentDate =
          parseAppointmentDate(
            appointment.date,
            appointment.time
          );

        if (!appointmentDate) {
          return true;
        }

        return (
          appointmentDate.getTime() <
          Date.now()
        );
      })
      .sort((a, b) => {
        const dateA = parseAppointmentDate(
          a.date,
          a.time
        );

        const dateB = parseAppointmentDate(
          b.date,
          b.time
        );

        if (!dateA || !dateB) {
          return 0;
        }

        return (
          dateB.getTime() - dateA.getTime()
        );
      });
  }, [employeeAppointments]);

  // ===================================================
  // ACTIVE TAB
  // ===================================================

  const activeAppointments = useMemo(() => {
    return activeTab === 'upcoming'
      ? upcomingAppointments
      : pastAppointments;
  }, [
    activeTab,
    upcomingAppointments,
    pastAppointments,
  ]);

  // ===================================================
  // STATUS FILTER
  // ===================================================

  const filteredAppointments = useMemo(() => {
    if (statusFilter === 'all') {
      return activeAppointments;
    }

    return activeAppointments.filter(
      (appointment) =>
        appointment.status?.toLowerCase() ===
        statusFilter
    );
  }, [
    activeAppointments,
    statusFilter,
  ]);

  // ===================================================
  // STATISTICS
  // ===================================================

  const pendingAppointments =
    employeeAppointments.filter(
      (appointment) =>
        appointment.status?.toLowerCase() ===
        'pending'
    );

  const confirmedAppointments =
    employeeAppointments.filter(
      (appointment) =>
        appointment.status?.toLowerCase() ===
        'confirmed'
    );

  const cancelledAppointments =
    employeeAppointments.filter(
      (appointment) =>
        appointment.status?.toLowerCase() ===
        'cancelled'
    );

  // ===================================================
  // UPDATE STATUS
  // ===================================================

  const updateAppointmentStatus = async (
    appointmentId: number,
    status: 'confirmed' | 'cancelled'
  ) => {
    try {
      setError('');

      const response = await fetch(
        `${apiBaseUrl}/api/appointments/${appointmentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to update appointment status.'
        );
      }

      await loadAppointments();

      setSelectedAppointment((current) => {
        if (
          !current ||
          current.id !== appointmentId
        ) {
          return current;
        }

        return {
          ...current,
          status,
        };
      });
    } catch (err) {
      console.error(
        'Update appointment status error:',
        err
      );

      setError(
        'Failed to update appointment status.'
      );
    }
  };

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (date: string) => {
    if (!date) {
      return 'N/A';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  };

  // ===================================================
  // FORMAT PRICE
  // ===================================================

  const formatPrice = (price: number) => {
    return `₱${Number(
      price || 0
    ).toLocaleString()}`;
  };

  // ===================================================
  // STATUS BADGE
  // ===================================================

  const getStatusBadge = (
    status: string
  ) => {
    const normalizedStatus =
      status?.toLowerCase();

    if (
      normalizedStatus === 'confirmed'
    ) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle2 size={14} />
          Confirmed
        </span>
      );
    }

    if (
      normalizedStatus === 'cancelled'
    ) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <XCircle size={14} />
          Cancelled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        <Clock3 size={14} />
        Pending
      </span>
    );
  };

  // ===================================================
  // STAT CARD
  // ===================================================

  const StatCard = ({
    title,
    value,
    icon,
    onClick,
    active,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md ${
          active
            ? 'border-pink-400 ring-2 ring-pink-100'
            : 'border-gray-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-800">
              {value}
            </p>
          </div>

          <div className="rounded-xl bg-pink-50 p-3 text-pink-500">
            {icon}
          </div>
        </div>
      </button>
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

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

  // ===================================================
  // NO LOGGED IN EMPLOYEE
  // ===================================================

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle
              size={35}
              className="mx-auto mb-3 text-red-500"
            />

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

  // ===================================================
  // MAIN
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-pink-500">
              Employee Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-800 md:text-3xl">
              Welcome, {currentUser.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your assigned customer appointments.
            </p>
          </div>

          
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

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

 

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Upcoming"
            value={upcomingAppointments.length}
            icon={
              <CalendarDays size={22} />
            }
            active={
              activeTab === 'upcoming' &&
              statusFilter === 'all'
            }
            onClick={() => {
              setActiveTab('upcoming');
              setStatusFilter('all');
            }}
          />

          <StatCard
            title="Pending"
            value={pendingAppointments.length}
            icon={<Clock3 size={22} />}
            active={
              statusFilter === 'pending'
            }
            onClick={() => {
              setActiveTab('upcoming');
              setStatusFilter('pending');
            }}
          />

          <StatCard
            title="Confirmed"
            value={confirmedAppointments.length}
            icon={
              <CheckCircle2 size={22} />
            }
            active={
              statusFilter === 'confirmed'
            }
            onClick={() => {
              setActiveTab('upcoming');
              setStatusFilter('confirmed');
            }}
          />

          <StatCard
            title="Cancelled"
            value={cancelledAppointments.length}
            icon={<XCircle size={22} />}
            active={
              statusFilter === 'cancelled'
            }
            onClick={() => {
              setActiveTab('past');
              setStatusFilter('cancelled');
            }}
          />
        </div>

        {/* =================================================
            APPOINTMENTS CONTAINER
        ================================================= */}

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* HEADER */}

          <div className="border-b border-gray-100 px-5 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  My Appointments
                </h2>

                <p className="text-sm text-gray-500">
                  {filteredAppointments.length}{' '}
                  appointment
                  {filteredAppointments.length !== 1
                    ? 's'
                    : ''}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* STATUS FILTER */}

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target
                        .value as StatusFilter
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                >
                  <option value="all">
                    All Status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            {/* =================================================
                TABS
            ================================================= */}

            <div className="mt-5 flex gap-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('upcoming');
                  setStatusFilter('all');
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming ({upcomingAppointments.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('past');
                  setStatusFilter('all');
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'past'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Past ({pastAppointments.length})
              </button>
            </div>
          </div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {filteredAppointments.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-5 text-gray-400">
                <CalendarDays size={32} />
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                No appointments found
              </h3>

              <p className="mt-1 max-w-md text-sm text-gray-500">
                {activeTab === 'upcoming'
                  ? 'You currently have no upcoming appointments matching this filter.'
                  : 'There are no past appointments matching this filter.'}
              </p>
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Service
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Date & Time
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Area
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Employee
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map(
                      (appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                        >

                          {/* CUSTOMER */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                                <User size={18} />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-800">
                                  {appointment.customerName ||
                                    `Customer #${appointment.customerId}`}
                                </p>

                                <p className="truncate text-xs text-gray-500">
                                  {appointment.customerEmail ||
                                    'No email available'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* SERVICE */}

                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">
                              {appointment.serviceName}
                            </p>

                            <p className="text-xs text-gray-500">
                              {appointment.category}
                            </p>
                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">
                              {formatDate(
                                appointment.date
                              )}
                            </p>

                            <p className="text-xs text-gray-500">
                              {appointment.time}
                            </p>
                          </td>

                          {/* AREA */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <MapPin
                                size={15}
                                className="text-pink-500"
                              />

                              {appointment.area}
                            </div>
                          </td>

                          {/* EMPLOYEE */}

                          <td className="px-5 py-4">
                            <div>
                              <p className="font-medium text-gray-800">
                                {appointment.employeeName ||
                                  `Employee #${appointment.employeeId}`}
                              </p>

                              <p className="text-xs text-gray-500">
                                {appointment.employeeEmail ||
                                  'No email available'}
                              </p>
                            </div>
                          </td>

                          {/* PRICE */}

                          <td className="px-5 py-4">
                            <span className="font-semibold text-gray-800">
                              {formatPrice(
                                appointment.price
                              )}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            {getStatusBadge(
                              appointment.status
                            )}
                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAppointment(
                                  appointment
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs font-semibold text-pink-600 transition hover:bg-pink-100"
                            >
                              <Eye size={15} />
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE
              ================================================= */}

              <div className="space-y-4 p-4 md:hidden">
                {filteredAppointments.map(
                  (appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-2xl border border-gray-100 p-4"
                    >

                      {/* CUSTOMER */}

                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                            <User size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-800">
                              {appointment.customerName ||
                                `Customer #${appointment.customerId}`}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                              {appointment.customerEmail ||
                                'No email available'}
                            </p>
                          </div>
                        </div>

                        {getStatusBadge(
                          appointment.status
                        )}
                      </div>

                      {/* SERVICE */}

                      <div className="mb-3 flex items-start gap-3">
                        <Scissors
                          size={17}
                          className="mt-0.5 shrink-0 text-pink-500"
                        />

                        <div>
                          <p className="text-xs text-gray-500">
                            Service
                          </p>

                          <p className="font-medium text-gray-800">
                            {appointment.serviceName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {appointment.category}
                          </p>
                        </div>
                      </div>

                      {/* DATE */}

                      <div className="mb-3 flex items-start gap-3">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 shrink-0 text-pink-500"
                        />

                        <div>
                          <p className="text-xs text-gray-500">
                            Schedule
                          </p>

                          <p className="font-medium text-gray-800">
                            {formatDate(
                              appointment.date
                            )}
                          </p>

                          <p className="text-xs text-gray-500">
                            {appointment.time}
                          </p>
                        </div>
                      </div>

                      {/* AREA */}

                      <div className="mb-3 flex items-start gap-3">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-pink-500"
                        />

                        <div>
                          <p className="text-xs text-gray-500">
                            Shop Area
                          </p>

                          <p className="font-medium text-gray-800">
                            {appointment.area}
                          </p>
                        </div>
                      </div>

                      {/* EMPLOYEE */}

                      <div className="mb-3 flex items-start gap-3">
                        <UserCheck
                          size={17}
                          className="mt-0.5 shrink-0 text-pink-500"
                        />

                        <div>
                          <p className="text-xs text-gray-500">
                            Assigned Employee
                          </p>

                          <p className="font-medium text-gray-800">
                            {appointment.employeeName ||
                              `Employee #${appointment.employeeId}`}
                          </p>
                        </div>
                      </div>

                      {/* PRICE */}

                      <div className="mb-4 flex items-start gap-3">
                        <PhilippinePeso
                          size={17}
                          className="mt-0.5 shrink-0 text-pink-500"
                        />

                        <div>
                          <p className="text-xs text-gray-500">
                            Price
                          </p>

                          <p className="font-semibold text-gray-800">
                            {formatPrice(
                              appointment.price
                            )}
                          </p>
                        </div>
                      </div>

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAppointment(
                            appointment
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
                      >
                        <Eye size={17} />
                        View Appointment
                      </button>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          APPOINTMENT DETAILS MODAL
      ===================================================== */}

      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() =>
            setSelectedAppointment(null)
          }
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Appointment Details
                </h2>

                <p className="text-xs text-gray-500">
                  Appointment #
                  {selectedAppointment.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAppointment(null)
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5">

              {/* CUSTOMER */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <User
                    size={18}
                    className="text-pink-500"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Customer Information
                  </h3>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-lg font-bold text-gray-800">
                    {selectedAppointment.customerName ||
                      `Customer #${selectedAppointment.customerId}`}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={15} />

                    <span>
                      {selectedAppointment.customerEmail ||
                        'No email available'}
                    </span>
                  </div>

                  {selectedAppointment.customerShopArea && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={15} />

                      <span>
                        Customer Area:{' '}
                        {
                          selectedAppointment.customerShopArea
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* SERVICE */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Scissors
                    size={18}
                    className="text-pink-500"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Service Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      Service
                    </p>

                    <p className="font-semibold text-gray-800">
                      {
                        selectedAppointment.serviceName
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Category
                    </p>

                    <p className="font-semibold text-gray-800">
                      {
                        selectedAppointment.category
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* SCHEDULE */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays
                    size={18}
                    className="text-pink-500"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Schedule
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      Date
                    </p>

                    <p className="font-semibold text-gray-800">
                      {formatDate(
                        selectedAppointment.date
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Time
                    </p>

                    <p className="font-semibold text-gray-800">
                      {
                        selectedAppointment.time
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* SHOP AREA */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MapPin
                    size={18}
                    className="text-pink-500"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Shop Area
                  </h3>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-800">
                    {selectedAppointment.area}
                  </p>
                </div>
              </div>

              {/* EMPLOYEE */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <UserCheck
                    size={18}
                    className="text-pink-500"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Assigned Employee
                  </h3>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-800">
                    {selectedAppointment.employeeName ||
                      `Employee #${selectedAppointment.employeeId}`}
                  </p>

                  {selectedAppointment.employeeEmail && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={15} />

                      <span>
                        {
                          selectedAppointment.employeeEmail
                        }
                      </span>
                    </div>
                  )}

                  {selectedAppointment.employeeShopArea && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={15} />

                      <span>
                        {
                          selectedAppointment.employeeShopArea
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PRICE */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <PhilippinePeso
                    size={18}
                    className="text-pink-500"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Price
                  </h3>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-2xl font-bold text-gray-800">
                    {formatPrice(
                      selectedAppointment.price
                    )}
                  </p>
                </div>
              </div>

              {/* STATUS */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Clock3
                    size={18}
                    className="text-pink-500"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Status
                  </h3>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  {getStatusBadge(
                    selectedAppointment.status
                  )}
                </div>
              </div>

              {/* NOTES */}

              {selectedAppointment.notes && (
                <div>
                  <h3 className="mb-3 font-semibold text-gray-800">
                    Notes
                  </h3>

                  <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    {
                      selectedAppointment.notes
                    }
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}

              {selectedAppointment.status?.toLowerCase() ===
                'pending' &&
                activeTab === 'upcoming' && (
                  <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">

                    <button
                      type="button"
                      onClick={() =>
                        updateAppointmentStatus(
                          selectedAppointment.id,
                          'confirmed'
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
                    >
                      <CheckCircle2
                        size={18}
                      />
                      Confirm Appointment
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateAppointmentStatus(
                          selectedAppointment.id,
                          'cancelled'
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      <XCircle size={18} />
                      Decline Appointment
                    </button>

                  </div>
                )}

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setSelectedAppointment(null)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;