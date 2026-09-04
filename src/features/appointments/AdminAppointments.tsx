import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

import {
  deleteAppointmentById,
  getAdminAppointments,
  updateAppointmentStatus,
} from '../../api/appointments.api';

import type { Appointment } from '../../types';

// Mirrors the backend's `type` query param (?type=appointment | walkin | all)
type TypeFilter = 'appointment' | 'walkin' | 'all';

// Mirrors the backend's `status` query param (case/whitespace-insensitive there)
type StatusFilter =
  | 'all'
  | 'Pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show';

const PAGE_SIZE = 10;

function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FILTERS
  // =========================================================

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('appointment');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        // Only send params the backend actually cares about — omit
        // `type` when it's the default ('appointment') and omit
        // `status` when it's 'all', so the request stays clean.
        const params: { type?: string; status?: string } = {};

        if (typeFilter !== 'appointment') {
          params.type = typeFilter;
        }

        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }

        const data = await getAdminAppointments(params);

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
  }, [typeFilter, statusFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(appointments.length / PAGE_SIZE)
  );

  // Reset to page 1 whenever filters change or the data set changes
  // (new fetch, delete, etc.) so the user isn't stranded on a page
  // that no longer has data.
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, statusFilter, appointments.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return appointments.slice(start, start + PAGE_SIZE);
  }, [appointments, currentPage]);

  const rangeStart =
    appointments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(
    currentPage * PAGE_SIZE,
    appointments.length
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis');
      }
    }

    return pages;
  }, [currentPage, totalPages]);

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

  const hasActiveFilters =
    typeFilter !== 'appointment' || statusFilter !== 'all';

  const clearFilters = () => {
    setTypeFilter('appointment');
    setStatusFilter('all');
  };

  // A small reusable status <select>, shared by both the mobile card
  // layout and the desktop table so the two views can't drift apart.
  const StatusSelect = ({ appointment }: { appointment: Appointment }) => (
    <select
      value={appointment.status}
      onChange={(event) => updateStatus(appointment.id, event.target.value)}
      className="w-full min-w-0 rounded-lg border border-pink-100 bg-[#fffafb] px-3 py-2 text-xs outline-none transition focus:border-[#df7f98] focus:ring-1 focus:ring-[#df7f98]"
    >
      <option value="Pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
      <option value="no-show">No Show</option>
    </select>
  );

  const DeleteButton = ({ appointment }: { appointment: Appointment }) => (
    <button
      type="button"
      onClick={() =>
        deleteAppointment(
          appointment.id,
          appointment.customerName || `Customer #${appointment.customerId}`
        )
      }
      className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#fee5e5] px-3 py-2 text-xs font-semibold text-[#c1433f] transition hover:bg-[#fdd5d5] sm:w-auto"
    >
      <Trash2 size={14} />
      Delete
    </button>
  );

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

      {/* =====================================================
          FILTERS
      ====================================================== */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
          {/* TYPE FILTER */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
              Type
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as TypeFilter)
              }
              className="w-full rounded-lg border border-pink-100 bg-[#fffafb] px-3 py-2 text-sm outline-none transition focus:border-[#df7f98] focus:ring-1 focus:ring-[#df7f98] sm:w-auto sm:min-w-[150px]"
            >
              <option value="appointment">Appointments</option>
              <option value="walkin">Walk-ins</option>
              <option value="all">All</option>
            </select>
          </div>

          {/* STATUS FILTER */}
          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="w-full rounded-lg border border-pink-100 bg-[#fffafb] px-3 py-2 text-sm outline-none transition focus:border-[#df7f98] focus:ring-1 focus:ring-[#df7f98] sm:w-auto sm:min-w-[150px]"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start rounded-lg border border-pink-200 bg-white px-3 py-2 text-xs font-semibold text-[#c15d78] transition hover:bg-[#fff0f4] sm:self-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}
      {loading ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        /* ========================================
            EMPTY STATE
        ======================================== */
        <div className="rounded-2xl border border-dashed border-pink-200 bg-[#fffafb] p-10 text-center shadow-sm">
          <p className="font-semibold text-[#5b3e45]">
            No appointments found.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          {/* ========================================
              MOBILE / TABLET: CARD LIST (below lg)
          ======================================== */}
          <div className="flex flex-col gap-3 lg:hidden">
            {paginatedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#5b3e45]">
                      {appointment.customerName ||
                        `Customer #${appointment.customerId}`}
                    </p>

                    {appointment.customerEmail && (
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {appointment.customerEmail}
                      </p>
                    )}
                  </div>

                  <span
                    className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${getAppointmentTypeClass(
                      appointment.appointmentType
                    )}`}
                  >
                    {formatAppointmentType(appointment.appointmentType)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div>
                    <p className="text-[#92737c]">Service</p>
                    <p className="truncate font-medium text-[#5b3e45]">
                      {appointment.serviceName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#92737c]">Area</p>
                    <p className="truncate font-medium text-[#5b3e45]">
                      {appointment.area}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#92737c]">Date</p>
                    <p className="font-medium text-[#5b3e45]">
                      {appointment.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#92737c]">Time</p>
                    <p className="font-medium text-[#5b3e45]">
                      {appointment.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#92737c]">Price</p>
                    <p className="font-bold text-[#5b3e45]">
                      PHP{' '}
                      {Number(appointment.price || 0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#92737c]">Status</p>
                    <span className="inline-flex rounded-full bg-[#fff5df] px-2 py-0.5 text-[11px] font-semibold uppercase text-[#b88a2c]">
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <StatusSelect appointment={appointment} />
                  <DeleteButton appointment={appointment} />
                </div>
              </div>
            ))}
          </div>

          {/* ========================================
              DESKTOP: TABLE (lg and up)
          ======================================== */}
          <div className="hidden overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fff4f6] text-[#5b3e45]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Time</th>
                    <th className="hidden px-4 py-3 font-semibold xl:table-cell">
                      Area
                    </th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="min-w-[230px] px-4 py-3 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-t border-pink-100 transition hover:bg-[#fffafb]"
                    >
                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="max-w-[160px] truncate font-medium text-[#5b3e45]">
                          {appointment.customerName ||
                            `Customer #${appointment.customerId}`}
                        </div>

                        {appointment.customerEmail && (
                          <div className="mt-0.5 max-w-[160px] truncate text-xs text-gray-500">
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
                        <span className="block max-w-[140px] truncate font-medium text-[#5b3e45]">
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
                      <td className="hidden px-4 py-3 xl:table-cell">
                        <span className="block max-w-[110px] truncate">
                          {appointment.area}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="whitespace-nowrap px-4 py-3">
                        PHP{' '}
                        {Number(appointment.price || 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-[#fff5df] px-2.5 py-1 text-xs font-semibold uppercase text-[#b88a2c]">
                          {appointment.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="min-w-[230px] px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-[130px] shrink-0">
                            <StatusSelect appointment={appointment} />
                          </div>
                          <DeleteButton appointment={appointment} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================
              PAGINATION
          ======================================== */}
          {totalPages > 1 && (
            <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-[#92737c]">
                Showing {rangeStart}–{rangeEnd} of {appointments.length}
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-pink-200 bg-white text-[#c15d78] transition hover:bg-[#fff0f4] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {pageNumbers.map((page, index) =>
                  page === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-1.5 text-sm text-[#92737c]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
                        page === currentPage
                          ? 'bg-[#df7f98] text-white'
                          : 'border border-pink-200 bg-white text-[#745d65] hover:bg-[#fff0f4]'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-pink-200 bg-white text-[#c15d78] transition hover:bg-[#fff0f4] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminAppointments;