import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, MapPin, X, AlertCircle, Edit2, Trash2 } from 'lucide-react';

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
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentItem | null>(null);
  const [editForm, setEditForm] = useState({ date: '', time: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const savedUser = localStorage.getItem('aisha_user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/appointments?customerId=${currentUser.id}`);
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const canCancelAppointment = (appointment: AppointmentItem): { allowed: boolean; reason: string } => {
    if (appointment.status === 'cancelled') {
      return { allowed: false, reason: 'Already cancelled' };
    }

    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return { allowed: false, reason: `Only ${Math.floor(hoursDifference)} hours left - cannot cancel within 24 hours` };
    }

    return { allowed: true, reason: '' };
  };

  const confirmAppointment = async (appointmentId: number) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (!response.ok) {
        throw new Error('Unable to confirm this appointment.');
      }

      setAppointments((current) =>
        current.map((item) =>
          item.id === appointmentId ? { ...item, status: 'confirmed' } : item
        )
      );

      setSuccess('Appointment confirmed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelAppointment = async (appointmentId: number) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;

    const { allowed, reason } = canCancelAppointment(appointment);
    if (!allowed) {
      setError(reason);
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Unable to cancel this appointment.');
      }

      setAppointments((current) =>
        current.map((item) =>
          item.id === appointmentId ? { ...item, status: 'cancelled' } : item
        )
      );

      setSuccess('Appointment cancelled successfully!');
      setSelectedAppointment(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditAppointment = (appointment: AppointmentItem) => {
    setEditingAppointment(appointment);
    setEditForm({ date: appointment.date, time: appointment.time });
    setError('');
  };

  const saveEditAppointment = async () => {
    if (!editingAppointment) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: editForm.date,
          time: editForm.time,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to update this appointment.');
      }

      setAppointments((current) =>
        current.map((item) =>
          item.id === editingAppointment.id
            ? { ...item, date: editForm.date, time: editForm.time }
            : item
        )
      );

      setSuccess('Appointment updated successfully!');
      setEditingAppointment(null);
      setSelectedAppointment(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAppointment = async (appointmentId: number) => {
    if (!window.confirm('Permanently delete this appointment? This cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Unable to delete this appointment.');
      }

      setAppointments((current) => current.filter((item) => item.id !== appointmentId));

      setSuccess('Appointment deleted successfully!');
      setSelectedAppointment(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">
          Manage your upcoming appointments and booking status.
        </p>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex gap-2 items-start text-sm text-red-700">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

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

                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="secondary-btn px-4 py-2 text-sm"
                  >
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
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#c18c2d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedAppointment && !editingAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
          <div className="rounded-3xl bg-white max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between bg-[#fff5f8] px-6 py-4 border-b border-pink-100">
              <h2 className="text-lg font-bold text-[#4b343b]">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-[#92737c] hover:text-[#4b343b]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Appointment Info */}
              <div>
                <p className="text-xs uppercase font-semibold text-[#92737c] mb-2">Service</p>
                <p className="text-lg font-bold text-[#4b343b]">{selectedAppointment.serviceName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase font-semibold text-[#92737c] mb-2">Date</p>
                  <p className="font-semibold text-[#4b343b]">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-[#92737c] mb-2">Time</p>
                  <p className="font-semibold text-[#4b343b]">{selectedAppointment.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase font-semibold text-[#92737c] mb-2">Category</p>
                  <p className="font-semibold text-[#4b343b]">{selectedAppointment.category}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-[#92737c] mb-2">Area</p>
                  <p className="font-semibold text-[#4b343b]">{selectedAppointment.area}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase font-semibold text-[#92737c] mb-2">Price</p>
                <p className="text-2xl font-bold text-[#c18c2d]">₱{selectedAppointment.price.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs uppercase font-semibold text-[#92737c] mb-2">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                    selectedAppointment.status === 'confirmed'
                      ? 'bg-green-50 text-green-600'
                      : selectedAppointment.status === 'cancelled'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-[#fff5df] text-[#b88a2c]'
                  }`}
                >
                  {selectedAppointment.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-pink-100 pt-4 space-y-3">
                {selectedAppointment.status !== 'cancelled' && (
                  <>
                    {/* Edit Button */}
                    <button
                      onClick={() => startEditAppointment(selectedAppointment)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#fff5f8] hover:bg-[#ffd4e0] px-4 py-3 font-semibold text-[#4b343b] transition-colors"
                    >
                      <Edit2 size={18} />
                      Edit Appointment
                    </button>

                    {/* Cancel Button */}
                    {canCancelAppointment(selectedAppointment).allowed ? (
                      <button
                        onClick={() => cancelAppointment(selectedAppointment.id)}
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-orange-50 hover:bg-orange-100 px-4 py-3 font-semibold text-orange-600 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'Cancelling...' : 'Cancel Appointment'}
                      </button>
                    ) : (
                      <div className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600 text-center border border-gray-200">
                        ⏰ {canCancelAppointment(selectedAppointment).reason}
                      </div>
                    )}
                  </>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => deleteAppointment(selectedAppointment.id)}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 px-4 py-3 font-semibold text-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Delete Permanently
                </button>

                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="w-full rounded-lg bg-[#4b343b] hover:bg-[#6b544b] px-4 py-3 font-semibold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
          <div className="rounded-3xl bg-white max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between bg-[#fff5f8] px-6 py-4 border-b border-pink-100">
              <h2 className="text-lg font-bold text-[#4b343b]">Edit Appointment</h2>
              <button
                onClick={() => setEditingAppointment(null)}
                className="text-[#92737c] hover:text-[#4b343b]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">Date</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="w-full rounded-lg border border-pink-200 px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">Time</label>
                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  className="w-full rounded-lg border border-pink-200 px-4 py-2 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingAppointment(null)}
                  className="flex-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 font-semibold text-[#4b343b]"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditAppointment}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-[#c18c2d] hover:bg-[#b07720] px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;