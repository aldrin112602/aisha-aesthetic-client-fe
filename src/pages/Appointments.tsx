import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, MapPin } from 'lucide-react';

interface AppointmentItem {
  id: number;
  customerId: number;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  area: string;
  price: number;
  status: string;
}

function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('aisha_user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    fetch(`${apiBaseUrl}/api/appointments?customerId=${currentUser.id}`)
      .then((response) => response.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const confirmAppointment = async (appointmentId: number) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    const response = await fetch(`${apiBaseUrl}/api/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' }),
    });

    if (!response.ok) {
      alert('Unable to confirm this appointment.');
      return;
    }

    setAppointments((current) =>
      current.map((item) =>
        item.id === appointmentId ? { ...item, status: 'confirmed' } : item
      )
    );
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">
          Manage your upcoming appointments and booking status.
        </p>
      </div>

      <div className="mb-6 flex gap-3 border-b border-pink-100">
        <button className="border-b-2 border-[#df7f98] px-4 py-3 text-sm font-semibold text-[#d77992]">
          Upcoming
        </button>

        <button className="px-4 py-3 text-sm font-medium text-[#92737c]">
          Past
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-6 text-sm text-[#7c5b63]">
          Loading your appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-6 text-sm text-[#7c5b63]">
          No appointments yet. Book your first service to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-[#4b343b]">
                      {appointment.serviceName}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-50 text-green-600'
                          : appointment.status === 'cancelled'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-[#fff5df] text-[#b88a2c]'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-[#80656d] sm:grid-cols-3">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {appointment.date}
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {appointment.time}
                    </span>

                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      {appointment.area}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <p className="text-lg font-bold text-[#c18c2d]">
                    ₱{appointment.price.toLocaleString()}
                  </p>

                  <button className="secondary-btn px-4 py-2 text-sm">
                    View Details
                  </button>
                </div>
              </div>

              {appointment.status === 'pending' && (
                <div className="mt-5 flex flex-col gap-3 rounded-xl bg-[#fff6e7] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-[#8b6523]">
                      <CheckCircle2 size={17} />
                      Please confirm your appointment
                    </p>

                    <p className="mt-1 text-xs text-[#9b7d45]">
                      Confirm your booking to secure your schedule.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => confirmAppointment(appointment.id)}
                    className="rounded-xl bg-[#c18c2d] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments;