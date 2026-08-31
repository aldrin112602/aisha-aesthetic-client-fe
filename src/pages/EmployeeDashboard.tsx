import { useEffect, useMemo, useState } from 'react';

interface EmployeeAppointment {
  id: number;
  customerId: number;
  employeeId: number | null;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  area: string;
  price: number;
  status: string;
}

function EmployeeDashboard() {
  const [appointments, setAppointments] = useState<EmployeeAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('aisha_user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    fetch(`${apiBaseUrl}/api/appointments`)
      .then((response) => response.json())
      .then((data) => {
        const filtered = Array.isArray(data)
          ? data.filter(
              (item) =>
                item.employeeId === null || item.employeeId === currentUser.id || item.customerId === currentUser.id
            )
          : [];

        setAppointments(filtered);
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const pending = appointments.filter((item) => item.status === 'pending').length;
    const confirmed = appointments.filter((item) => item.status === 'confirmed').length;
    const cancelled = appointments.filter((item) => item.status === 'cancelled').length;

    return { pending, confirmed, cancelled };
  }, [appointments]);

  const updateStatus = async (appointmentId: number, nextStatus: string) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    const response = await fetch(`${apiBaseUrl}/api/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      alert('Unable to update appointment status.');
      return;
    }

    setAppointments((current) =>
      current.map((item) =>
        item.id === appointmentId ? { ...item, status: nextStatus } : item
      )
    );
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Employee Dashboard</h1>
      <p className="page-subtitle">Assigned appointments, reminders, and daily service updates.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Pending', stats.pending],
          ['Confirmed', stats.confirmed],
          ['Cancelled', stats.cancelled],
          ['Assigned', appointments.length],
        ].map(([label, value]) => (
          <div key={String(label)} className="pink-card">
            <p className="text-sm text-[#92737c]">{label}</p>
            <p className="mt-3 text-3xl font-bold text-[#4b343b]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">Appointment Status</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>Pending: {stats.pending}</li>
            <li>Confirmed: {stats.confirmed}</li>
            <li>Cancelled: {stats.cancelled}</li>
            <li>Assigned open bookings: {appointments.length}</li>
          </ul>
        </div>

        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">Notifications</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>Upcoming appointment in 2 days</li>
            <li>Retouch reminder due</li>
            <li>Walk-in customer recorded</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[#4b343b]">Appointment Queue</h2>

        {loading ? (
          <div className="mt-4 text-sm text-[#7c5b63]">Loading appointment queue...</div>
        ) : appointments.length === 0 ? (
          <div className="mt-4 text-sm text-[#7c5b63]">No open appointments assigned yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-xl border border-pink-100 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#4b343b]">{appointment.serviceName}</p>
                    <p className="text-sm text-[#745d65]">
                      {appointment.date} · {appointment.time} · {appointment.area}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#fff5df] px-2.5 py-1 text-xs font-semibold uppercase text-[#b88a2c]">
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(appointment.id, 'confirmed')}
                    className="rounded-lg bg-[#d77992] px-3 py-2 text-xs font-semibold text-white"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(appointment.id, 'cancelled')}
                    className="rounded-lg border border-pink-200 bg-white px-3 py-2 text-xs font-semibold text-[#705760]"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
