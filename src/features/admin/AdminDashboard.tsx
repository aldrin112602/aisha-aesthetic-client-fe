import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Users,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: number;

  customerId: number;
  customerName?: string | null;
  customerEmail?: string | null;

  employeeId?: number | null;
  employeeName?: string | null;

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

interface DashboardCounts {
  todayAppointments: number;
  upcomingAppointments: number;
  pendingApproval: number;
  confirmed: number;

  completed: number;
  cancelled: number;
  noShow: number;
}

const initialCounts: DashboardCounts = {
  todayAppointments: 0,
  upcomingAppointments: 0,
  pendingApproval: 0,
  confirmed: 0,

  completed: 0,
  cancelled: 0,
  noShow: 0,
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counts, setCounts] =
    useState<DashboardCounts>(initialCounts);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3001';

  // =========================================================
  // GET LOCAL DATE
  // IMPORTANT:
  // We do NOT use new Date("YYYY-MM-DD")
  // because timezone conversion can shift the date.
  // =========================================================

  const getLocalDateString = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      today.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // =========================================================
  // NORMALIZE STATUS
  // Handles:
  // pending
  // Pending
  // pending approval
  // pending_approval
  // confirmed
  // no-show
  // no_show
  // etc.
  // =========================================================

  const normalizeStatus = (status?: string | null) => {
    return String(status || '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');
  };

  // =========================================================
  // LOAD APPOINTMENTS
  // =========================================================

  const loadAppointments = useCallback(async () => {
    try {
      setError('');

      const response = await fetch(
        `${apiBaseUrl}/api/appointments`
      );

      if (!response.ok) {
        throw new Error(
          'Failed to fetch appointments.'
        );
      }

      const data = await response.json();

      const appointmentData: Appointment[] =
        Array.isArray(data) ? data : [];

      setAppointments(appointmentData);

      // -----------------------------------------------------
      // CALCULATE DASHBOARD COUNTS
      // -----------------------------------------------------

      const today = getLocalDateString();

      let todayAppointments = 0;
      let upcomingAppointments = 0;
      let pendingApproval = 0;
      let confirmed = 0;

      let completed = 0;
      let cancelled = 0;
      let noShow = 0;

      appointmentData.forEach((appointment) => {
        const appointmentDate = String(
          appointment.date || ''
        ).slice(0, 10);

        const status = normalizeStatus(
          appointment.status
        );

        // ===================================================
        // STATUS COUNTS
        // ===================================================

        if (
          status === 'pending' ||
          status === 'pendingapproval'
        ) {
          pendingApproval++;
        }

        if (status === 'confirmed') {
          confirmed++;
        }

        if (status === 'completed') {
          completed++;
        }

        if (
          status === 'cancelled' ||
          status === 'canceled'
        ) {
          cancelled++;
        }

        if (
          status === 'noshow' ||
          status === 'noattendance'
        ) {
          noShow++;
        }

        // ===================================================
        // TODAY'S APPOINTMENTS
        //
        // Count actual bookings scheduled today.
        //
        // Cancelled and no-show appointments are excluded
        // because they are no longer active appointments.
        // ===================================================

        const isCancelled =
          status === 'cancelled' ||
          status === 'canceled';

        const isNoShow =
          status === 'noshow' ||
          status === 'noattendance';

        if (
          appointmentDate === today &&
          !isCancelled &&
          !isNoShow
        ) {
          todayAppointments++;
        }

        // ===================================================
        // UPCOMING APPOINTMENTS
        //
        // Future date only.
        //
        // Exclude:
        // - cancelled
        // - completed
        // - no-show
        // ===================================================

        const isCompleted =
          status === 'completed';

        if (
          appointmentDate > today &&
          !isCancelled &&
          !isCompleted &&
          !isNoShow
        ) {
          upcomingAppointments++;
        }
      });

      setCounts({
        todayAppointments,
        upcomingAppointments,
        pendingApproval,
        confirmed,
        completed,
        cancelled,
        noShow,
      });
    } catch (err) {
      console.error(
        'Failed to load dashboard appointments:',
        err
      );

      setError(
        'Unable to load appointment data.'
      );

      setAppointments([]);
      setCounts(initialCounts);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadAppointments();
    } finally {
      setRefreshing(false);
    }
  };

  // =========================================================
  // TODAY'S APPOINTMENT LIST
  // =========================================================

  const todaysAppointments = useMemo(() => {
    const today = getLocalDateString();

    return appointments
      .filter((appointment) => {
        const appointmentDate = String(
          appointment.date || ''
        ).slice(0, 10);

        const status = normalizeStatus(
          appointment.status
        );

        const isCancelled =
          status === 'cancelled' ||
          status === 'canceled';

        const isNoShow =
          status === 'noshow' ||
          status === 'noattendance';

        return (
          appointmentDate === today &&
          !isCancelled &&
          !isNoShow
        );
      })
      .sort((a, b) => {
        return String(a.time || '').localeCompare(
          String(b.time || '')
        );
      });
  }, [appointments]);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time: string) => {
    if (!time) {
      return '--';
    }

    const [hoursString, minutesString] =
      time.split(':');

    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return time;
    }

    const date = new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const renderStatusBadge = (
    status: string
  ) => {
    const normalized = normalizeStatus(status);

    if (normalized === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf9f1] px-2.5 py-1 text-xs font-semibold text-[#2f7d59]">
          <CheckCircle2 size={13} />
          Confirmed
        </span>
      );
    }

    if (
      normalized === 'completed'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#4169a1]">
          <CheckCircle2 size={13} />
          Completed
        </span>
      );
    }

    if (
      normalized === 'cancelled' ||
      normalized === 'canceled'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500">
          <XCircle size={13} />
          Cancelled
        </span>
      );
    }

    if (
      normalized === 'noshow' ||
      normalized === 'noattendance'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
          <AlertCircle size={13} />
          No Show
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4e5] px-2.5 py-1 text-xs font-semibold text-[#b87918]">
        <Clock3 size={13} />
        Pending
      </span>
    );
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-[#d77992]"
            />

            <p className="mt-3 text-sm text-[#92737c]">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="page-container">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">
            Admin Dashboard
          </h1>

          <p className="page-subtitle">
            Overview of customer appointments and bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#d77992] transition hover:bg-[#fff7f9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? 'animate-spin'
                : ''
            }
          />

          {refreshing
            ? 'Refreshing...'
            : 'Refresh'}
        </button>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={18} />

          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* TODAY */}
        <button
          type="button"
          onClick={() =>
            navigate('/admin-appointments')
          }
          className="pink-card w-full cursor-pointer text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d77992] active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#92737c]">
                Today's Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#4b343b]">
                {counts.todayAppointments}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f4] text-[#d77992]">
              <CalendarDays size={20} />
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[#d77992]">
            View appointments
            <ChevronRight size={14} />
          </p>
        </button>

        {/* UPCOMING */}
        <button
          type="button"
          onClick={() =>
            navigate('/admin-appointments')
          }
          className="pink-card w-full cursor-pointer text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d77992] active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#92737c]">
                Upcoming Appointments
              </p>

              <p className="mt-3 text-3xl font-bold text-[#4b343b]">
                {counts.upcomingAppointments}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f4] text-[#d77992]">
              <Clock3 size={20} />
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[#d77992]">
            View appointments
            <ChevronRight size={14} />
          </p>
        </button>

        {/* PENDING */}
        <button
          type="button"
          onClick={() =>
            navigate('/admin-appointments')
          }
          className="pink-card w-full cursor-pointer text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d77992] active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#92737c]">
                Pending Approval
              </p>

              <p className="mt-3 text-3xl font-bold text-[#4b343b]">
                {counts.pendingApproval}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff4e5] text-[#b87918]">
              <AlertCircle size={20} />
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[#d77992]">
            Review bookings
            <ChevronRight size={14} />
          </p>
        </button>

        {/* CONFIRMED */}
        <button
          type="button"
          onClick={() =>
            navigate('/admin-appointments')
          }
          className="pink-card w-full cursor-pointer text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d77992] active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#92737c]">
                Confirmed
              </p>

              <p className="mt-3 text-3xl font-bold text-[#4b343b]">
                {counts.confirmed}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf9f1] text-[#2f7d59]">
              <UserCheck size={20} />
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[#d77992]">
            View confirmed
            <ChevronRight size={14} />
          </p>
        </button>
      </div>

      {/* =====================================================
          TODAY'S APPOINTMENTS
      ====================================================== */}

      <div className="mt-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#4b343b]">
              Today's Appointments
            </h2>

            <p className="mt-1 text-sm text-[#92737c]">
              {getLocalDateString()}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/admin-appointments')
            }
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#d77992] hover:underline"
          >
            View All
            <ChevronRight size={15} />
          </button>
        </div>

        {todaysAppointments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-pink-200 bg-[#fffafb] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f4] text-[#d77992]">
              <CalendarDays size={22} />
            </div>

            <p className="mt-3 font-semibold text-[#4b343b]">
              No appointments today
            </p>

            <p className="mt-1 text-sm text-[#92737c]">
              There are no active customer bookings scheduled for today.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-pink-100 text-xs uppercase tracking-wide text-[#92737c]">
                  <th className="px-4 py-3 font-semibold">
                    Time
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Customer
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Service
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Area
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {todaysAppointments.map(
                  (appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-pink-50 last:border-0 hover:bg-[#fffafb]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 font-semibold text-[#4b343b]">
                          <Clock3
                            size={15}
                            className="text-[#d77992]"
                          />

                          {formatTime(
                            appointment.time
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-[#4b343b]">
                            {appointment.customerName ||
                              'Customer'}
                          </p>

                          {appointment.customerEmail && (
                            <p className="mt-0.5 text-xs text-[#92737c]">
                              {appointment.customerEmail}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-[#5d424a]">
                          {appointment.serviceName}
                        </p>

                        <p className="mt-0.5 text-xs text-[#92737c]">
                          {appointment.category}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-[#745d65]">
                        {appointment.area}
                      </td>

                      <td className="px-4 py-4">
                        {renderStatusBadge(
                          appointment.status
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          APPOINTMENT STATUS
      ====================================================== */}

      <div className="mt-8 grid gap-5 xl:grid-cols-2">

        <div className="pink-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f4] text-[#d77992]">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#4b343b]">
                Appointment Status
              </h2>

              <p className="text-xs text-[#92737c]">
                Based on actual customer bookings
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">

            {/* COMPLETED */}
            <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[#6d4a54]">
                <CheckCircle2
                  size={16}
                  className="text-[#4169a1]"
                />

                Completed Appointments
              </div>

              <span className="font-bold text-[#4b343b]">
                {counts.completed}
              </span>
            </div>

            {/* CANCELLED */}
            <div className="flex items-center justify-between rounded-xl bg-red-50/60 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[#6d4a54]">
                <XCircle
                  size={16}
                  className="text-red-500"
                />

                Cancelled Appointments
              </div>

              <span className="font-bold text-[#4b343b]">
                {counts.cancelled}
              </span>
            </div>

            {/* NO SHOW */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[#6d4a54]">
                <AlertCircle
                  size={16}
                  className="text-gray-500"
                />

                No Show Appointments
              </div>

              <span className="font-bold text-[#4b343b]">
                {counts.noShow}
              </span>
            </div>

            {/* TOTAL */}
            <div className="flex items-center justify-between rounded-xl bg-[#fff8fa] px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#6d4a54]">
                <Users
                  size={16}
                  className="text-[#d77992]"
                />

                Total Bookings
              </div>

              <span className="font-bold text-[#d77992]">
                {appointments.length}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            BOOKING SUMMARY
        ==================================================== */}

        <div className="pink-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f4] text-[#d77992]">
              <UserCheck size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#4b343b]">
                Booking Summary
              </h2>

              <p className="text-xs text-[#92737c]">
                Current customer booking status
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">

            {/* PENDING */}
            <button
              type="button"
              onClick={() =>
                navigate('/admin-appointments')
              }
              className="flex w-full items-center justify-between rounded-xl bg-[#fff4e5] px-4 py-3 text-left transition hover:brightness-95"
            >
              <div className="flex items-center gap-2 text-sm text-[#6d4a54]">
                <AlertCircle
                  size={16}
                  className="text-[#b87918]"
                />

                Pending Approval
              </div>

              <span className="font-bold text-[#4b343b]">
                {counts.pendingApproval}
              </span>
            </button>

            {/* CONFIRMED */}
            <button
              type="button"
              onClick={() =>
                navigate('/admin-appointments')
              }
              className="flex w-full items-center justify-between rounded-xl bg-[#edf9f1] px-4 py-3 text-left transition hover:brightness-95"
            >
              <div className="flex items-center gap-2 text-sm text-[#6d4a54]">
                <CheckCircle2
                  size={16}
                  className="text-[#2f7d59]"
                />

                Confirmed
              </div>

              <span className="font-bold text-[#4b343b]">
                {counts.confirmed}
              </span>
            </button>

            {/* TODAY */}
            <button
              type="button"
              onClick={() =>
                navigate('/admin-appointments')
              }
              className="flex w-full items-center justify-between rounded-xl bg-[#fff8fa] px-4 py-3 text-left transition hover:brightness-95"
            >
              <div className="flex items-center gap-2 text-sm text-[#6d4a54]">
                <CalendarDays
                  size={16}
                  className="text-[#d77992]"
                />

                Today's Appointments
              </div>

              <span className="font-bold text-[#4b343b]">
                {counts.todayAppointments}
              </span>
            </button>

            {/* UPCOMING */}
            <button
              type="button"
              onClick={() =>
                navigate('/admin-appointments')
              }
              className="flex w-full items-center justify-between rounded-xl bg-[#fff8fa] px-4 py-3 text-left transition hover:brightness-95"
            >
              <div className="flex items-center gap-2 text-sm text-[#6d4a54]">
                <Clock3
                  size={16}
                  className="text-[#d77992]"
                />

                Upcoming Appointments
              </div>

              <span className="font-bold text-[#4b343b]">
                {counts.upcomingAppointments}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;