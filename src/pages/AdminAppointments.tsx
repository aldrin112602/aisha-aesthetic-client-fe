import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

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
  const [loading, setLoading] = useState(true);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${apiBaseUrl}/api/bookings`);

        if (!response.ok) {
          throw new Error('Failed to fetch appointments.');
        }

        const data = await response.json();

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching appointments:', error);

        setAppointments([]);

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load',
          text: 'Unable to load appointment records.',
          confirmButtonColor: '#df7f98',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [apiBaseUrl]);

  const updateStatus = async (
    appointmentId: number,
    nextStatus: string
  ) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/appointments/${appointmentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Unable to update appointment status.');
      }

      setAppointments((current) =>
        current.map((item) =>
          item.id === appointmentId
            ? {
                ...item,
                status: nextStatus,
              }
            : item
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Appointment status changed to ${nextStatus}.`,
        confirmButtonColor: '#df7f98',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Unable to update appointment status.',
        confirmButtonColor: '#df7f98',
      });
    }
  };

  const deleteAppointment = async (
    appointmentId: number,
    customerId: number
  ) => {
    // SweetAlert confirmation
    const result = await Swal.fire({
      title: 'Delete Appointment?',
      text: `Are you sure you want to delete the appointment for Customer #${customerId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#c1433f',
      cancelButtonColor: '#9ca3af',
      reverseButtons: true,
      focusCancel: true,
    });

    // User clicked Cancel
    if (!result.isConfirmed) {
      return;
    }

    try {
      // Show loading SweetAlert
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait while the appointment is being deleted.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(
        `${apiBaseUrl}/api/appointments/${appointmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Unable to delete appointment.');
      }

      // Remove from UI
      setAppointments((current) =>
        current.filter((item) => item.id !== appointmentId)
      );

      // Success SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `Appointment for Customer #${customerId} has been deleted.`,
        confirmButtonColor: '#df7f98',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);

      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Unable to delete the appointment. Please try again.',
        confirmButtonColor: '#df7f98',
      });
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Admin Appointments</h1>

        <p className="page-subtitle">
          Review all appointment records and update status.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#fff4f6] text-[#5b3e45]">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  Customer
                </th>

                <th className="px-4 py-3 font-semibold">
                  Service
                </th>

                <th className="px-4 py-3 font-semibold">
                  Date
                </th>

                <th className="px-4 py-3 font-semibold">
                  Time
                </th>

                <th className="px-4 py-3 font-semibold">
                  Area
                </th>

                <th className="px-4 py-3 font-semibold">
                  Price
                </th>

                <th className="px-4 py-3 font-semibold">
                  Status
                </th>

                <th className="px-4 py-3 font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-t border-pink-100"
                  >
                    <td className="px-4 py-3">
                      Customer #{appointment.customerId}
                    </td>

                    <td className="px-4 py-3">
                      {appointment.serviceName}
                    </td>

                    <td className="px-4 py-3">
                      {appointment.date}
                    </td>

                    <td className="px-4 py-3">
                      {appointment.time}
                    </td>

                    <td className="px-4 py-3">
                      {appointment.area}
                    </td>

                    <td className="px-4 py-3">
                      ₱{appointment.price.toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#fff5df] px-2.5 py-1 text-xs font-semibold uppercase text-[#b88a2c]">
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <select
                          value={appointment.status}
                          onChange={(event) =>
                            updateStatus(
                              appointment.id,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-pink-100 bg-[#fffafb] px-2 py-2 text-xs outline-none focus:border-[#df7f98]"
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="completed">
                            Completed
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>

                          <option value="no-show">
                            No Show
                          </option>
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            deleteAppointment(
                              appointment.id,
                              appointment.customerId
                            )
                          }
                          className="flex items-center gap-1 rounded-lg bg-[#fee5e5] px-3 py-2 text-xs font-semibold text-[#c1433f] transition hover:bg-[#fdd5d5]"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAppointments;