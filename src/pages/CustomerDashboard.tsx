import { useEffect, useState } from 'react';

interface DashboardAppointment {
  id: number;
  serviceName: string;
  date: string;
  time: string;
  area: string;
  status: string;
}

function CustomerDashboard() {
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('aisha_user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    if (!currentUser) {
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    fetch(`${apiBaseUrl}/api/appointments?customerId=${currentUser.id}`)
      .then((response) => response.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setAppointments([]));
  }, []);

  const upcoming = appointments.filter((item) => item.status !== 'cancelled').length;
  const latestStatus = appointments[0]?.status || 'No bookings yet';

  return (
    <div className="page-container">
      <h1 className="page-title">Customer Dashboard</h1>
      <p className="page-subtitle">Track your appointments, service history, and reminders.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Upcoming Appointment', String(upcoming)],
          ['Appointment Status', latestStatus],
          ['Service History', String(appointments.length)],
          ['Follow-ups', '2'],
        ].map(([label, value]) => (
          <div key={String(label)} className="pink-card">
            <p className="text-sm text-[#92737c]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[#4b343b]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">My Appointments</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            {appointments.length === 0 ? (
              <li>No bookings yet.</li>
            ) : (
              appointments.slice(0, 3).map((appointment) => (
                <li key={appointment.id}>
                  {appointment.serviceName} — {appointment.date} · {appointment.time} · {appointment.area}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">Notifications</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>Booking confirmation received</li>
            <li>Appointment reminder tomorrow</li>
            <li>Retouch due soon</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
