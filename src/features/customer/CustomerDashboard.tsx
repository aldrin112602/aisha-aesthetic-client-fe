import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CalendarDays, Clock } from 'lucide-react';

import { getCustomerAppointments } from '../../api/appointments.api';
import type { Appointment } from '../../types';

function CustomerDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('aisha_user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    if (!currentUser) {
      navigate('/signin');
      return;
    }

    getCustomerAppointments(currentUser.id)
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((fetchError) => {
        console.error('Failed to fetch appointments:', fetchError);
        setError(
          'Unable to load appointments. Make sure the backend server is running.'
        );
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const upcoming = appointments.filter((item) => item.status !== 'cancelled').length;
  const latestStatus = appointments[0]?.status || 'No bookings yet';

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Customer Dashboard</h1>
        <div className="mt-6 text-center text-[#92737c]">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Customer Dashboard</h1>
      <p className="page-subtitle">
        Track your appointments, service history, and reminders.
      </p>

      {error && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="flex-shrink-0 text-red-600" size={20} />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Connection Error
            </p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Upcoming Appointment', value: String(upcoming), icon: CalendarDays },
          { label: 'Appointment Status', value: latestStatus, icon: Clock },
          { label: 'Service History', value: String(appointments.length), icon: CalendarDays },
          { label: 'Follow-ups', value: '0', icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="pink-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#92737c]">{label}</p>
                <p className="mt-3 text-2xl font-bold text-[#4b343b]">
                  {value}
                </p>
              </div>
              <Icon size={20} className="text-[#c18c2d]" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">My Appointments</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            {appointments.length === 0 ? (
              <li className="text-[#92737c]">
                No bookings yet.{' '}
                <a
                  href="/booking"
                  className="font-semibold text-[#d77992] hover:underline"
                >
                  Book now
                </a>
              </li>
            ) : (
              appointments.slice(0, 3).map((appointment) => (
                <li key={appointment.id} className="flex gap-2">
                  <span className="text-[#c18c2d]">•</span>
                  <span>
                    {appointment.serviceName} - {appointment.date} ·{' '}
                    {appointment.time} · {appointment.area}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">Notifications</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li className="flex gap-2">
              <span className="text-[#c18c2d]">•</span>
              <span>Welcome to Aisha Aesthetics!</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#c18c2d]">•</span>
              <span>Book your first appointment now</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#c18c2d]">•</span>
              <span>Exclusive offers available</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
