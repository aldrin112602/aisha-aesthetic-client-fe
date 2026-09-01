import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Appointment { 
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

function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    fetch(`${apiBaseUrl}/api/bookings`)
      .then((response) => response.json())
      .then((data) => setAppointments(data))
      .catch(() => setAppointments([]));
  }, []);

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

  const deleteAppointment = async (appointmentId: number, customerName: string) => {
    if (!window.confirm(`Are you sure you want to delete the appointment for Customer #${customerName}?`)) {
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    const response = await fetch(`${apiBaseUrl}/api/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      alert('Unable to delete appointment.');
      return;
    }

    setAppointments((current) =>
      current.filter((item) => item.id !== appointmentId)
    );
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Admin Appointments</h1>
        <p className="page-subtitle">Review all appointment records and update status.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#fff4f6] text-[#5b3e45]">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Area</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t border-pink-100">
                  <td className="px-4 py-3">Customer #{appointment.customerId}</td>
                  <td className="px-4 py-3">{appointment.serviceName}</td>
                  <td className="px-4 py-3">{appointment.date}</td>
                  <td className="px-4 py-3">{appointment.time}</td>
                  <td className="px-4 py-3">{appointment.area}</td>
                  <td className="px-4 py-3">₱{appointment.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#fff5df] px-2.5 py-1 text-xs font-semibold text-[#b88a2c] uppercase">
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <select
                        value={appointment.status}
                        onChange={(event) => updateStatus(appointment.id, event.target.value)}
                        className="rounded-lg border border-pink-100 bg-[#fffafb] px-2 py-2 text-xs outline-none focus:border-[#df7f98]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No Show</option>
                      </select>
                      <button
                        onClick={() => deleteAppointment(appointment.id, appointment.customerId)}
                        className="flex items-center gap-1 rounded-lg bg-[#fee5e5] px-3 py-2 text-xs font-semibold text-[#c1433f] hover:bg-[#fdd5d5]"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAppointments;
