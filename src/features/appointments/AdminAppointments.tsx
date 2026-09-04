import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

import {
  deleteAppointmentById,
  getAdminAppointments,
  updateAppointmentStatus,
} from '../../api/appointments.api';

import type { Appointment } from '../../types';

function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const data = await getAdminAppointments();

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
  }, []);

  const updateStatus = async (
    appointmentId: number,
    nextStatus: string
  ) => {
    try {
      await updateAppointmentStatus(
        appointmentId,
        nextStatus
      );

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
      console.error(
        'Error updating appointment status:',
        error
      );

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
    customerName: string
  ) => {
    const displayCustomerName =
      customerName || 'this customer';

    const result = await Swal.fire({
      title: 'Delete Appointment?',
      text: `Are you sure you want to delete the appointment for ${displayCustomerName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#c1433f',
      cancelButtonColor: '#9ca3af',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
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

      await deleteAppointmentById(appointmentId);

      setAppointments((current) =>
        current.filter(
          (item) => item.id !== appointmentId
        )
      );

      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `Appointment for ${displayCustomerName} has been deleted.`,
        confirmButtonColor: '#df7f98',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        'Error deleting appointment:',
        error
      );

      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Unable to delete the appointment. Please try again.',
        confirmButtonColor: '#df7f98',
      });
    }
  };

  const formatAppointmentType = (
    appointmentType?: string | null
  ) => {
    if (!appointmentType) {
      return 'Online';
    }

    if (
      appointmentType.toLowerCase() === 'walkin' ||
      appointmentType.toLowerCase() === 'walk-in'
    ) {
      return 'Walk-in';
    }

    return 'Online';
  };

  const getAppointmentTypeClass = (
    appointmentType?: string | null
  ) => {
    if (
      appointmentType &&
      (
        appointmentType.toLowerCase() === 'walkin' ||
        appointmentType.toLowerCase() === 'walk-in'
      )
    ) {
      return 'bg-[#fff5df] text-[#b88a2c]';
    }

    return 'bg-[#f3e8ff] text-[#7e4ba8]';
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="page-title">
          Admin Appointments
        </h1>

        <p className="page-subtitle">
          Review all appointment records and update status.
        </p>
      </div>

      {/* Appointments Table */}
      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#fff4f6] text-[#5b3e45]">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  Customer
                </th>

                <th className="px-4 py-3 font-semibold">
                  Appointment Type
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

                <th className="min-w-[250px] px-4 py-3 font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                /* Empty */
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-t border-pink-100 transition hover:bg-[#fffafb]"
                  >
                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#5b3e45]">
                        {appointment.customerName ||
                          `Customer #${appointment.customerId}`}
                      </div>

                      {appointment.customerEmail && (
                        <div className="mt-0.5 text-xs text-gray-500">
                          {appointment.customerEmail}
                        </div>
                      )}
                    </td>

                    {/* Appointment Type */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${getAppointmentTypeClass(
                          appointment.appointmentType
                        )}`}
                      >
                        {formatAppointmentType(
                          appointment.appointmentType
                        )}
                      </span>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-[#5b3e45]">
                        {appointment.serviceName}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3">
                      {appointment.date}
                    </td>

                    {/* Time */}
                    <td className="whitespace-nowrap px-4 py-3">
                      {appointment.time}
                    </td>

                    {/* Area */}
                    <td className="px-4 py-3">
                      {appointment.area}
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-4 py-3">
                      PHP{' '}
                      {Number(
                        appointment.price || 0
                      ).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-[#fff5df] px-2.5 py-1 text-xs font-semibold uppercase text-[#b88a2c]">
                        {appointment.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="min-w-[250px] px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Status Dropdown */}
                        <select
                          value={appointment.status}
                          onChange={(event) =>
                            updateStatus(
                              appointment.id,
                              event.target.value
                            )
                          }
                          className="min-w-[125px] rounded-lg border border-pink-100 bg-[#fffafb] px-3 py-2 text-xs outline-none transition focus:border-[#df7f98] focus:ring-1 focus:ring-[#df7f98]"
                        >
                          <option value="Pending">
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

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() =>
                            deleteAppointment(
                              appointment.id,
                              appointment.customerName ||
                                `Customer #${appointment.customerId}`
                            )
                          }
                          className="flex min-w-[92px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#fee5e5] px-3 py-2 text-xs font-semibold text-[#c1433f] transition hover:bg-[#fdd5d5]"
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