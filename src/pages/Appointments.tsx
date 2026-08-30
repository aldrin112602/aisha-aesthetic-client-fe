import { CalendarDays, CheckCircle2, Clock3, MapPin } from 'lucide-react';

const appointments = [
  {
    id: 1,
    service: 'Classic Facial',
    date: 'August 30, 2026',
    time: '2:00 PM',
    location: 'Main Branch - Area A',
    price: 1500,
    status: 'Confirmed',
  },
  {
    id: 2,
    service: 'Laser Rejuvenation',
    date: 'September 5, 2026',
    time: '11:00 AM',
    location: 'VIP Treatment Room',
    price: 3500,
    status: 'Pending Confirmation',
  },
];

function Appointments() {
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
                    {appointment.service}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      appointment.status === 'Confirmed'
                        ? 'bg-green-50 text-green-600'
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
                    {appointment.location}
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

            {appointment.status === 'Pending Confirmation' && (
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

                <button className="rounded-xl bg-[#c18c2d] px-4 py-2 text-sm font-semibold text-white">
                  Confirm
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Appointments;