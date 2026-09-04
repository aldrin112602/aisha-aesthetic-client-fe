import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MapPin,
  User,
} from "lucide-react";
import type { WalkinRecord, RecentWalkinsProps } from "../../../types";

const PAGE_SIZE = 10;

const RecentWalkins: React.FC<RecentWalkinsProps> = ({ walkins }) => {
  // =========================================================
  // PAGINATION STATE
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(walkins.length / PAGE_SIZE));

  // Reset to page 1 whenever the underlying data changes (e.g. after a
  // refresh or a new walk-in is recorded) so the user isn't stranded on
  // a page that no longer exists.
  useEffect(() => {
    setCurrentPage(1);
  }, [walkins]);

  // Clamp in case the list shrinks while on a later page.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedWalkins = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return walkins.slice(start, start + PAGE_SIZE);
  }, [walkins, currentPage]);

  const rangeStart = walkins.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, walkins.length);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  // Build a compact page-number list: 1 ... current-1, current, current+1 ... last
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusBadge = (status: string | null) => {
    const normalizedStatus = status?.toLowerCase();

    const statusStyles: Record<string, string> = {
      completed: "bg-green-50 text-green-700 border border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      cancelled: "bg-red-50 text-red-700 border border-red-200",
      confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
      ongoing: "bg-purple-50 text-purple-700 border border-purple-200",
    };

    return (
      <span
        className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
          statusStyles[normalizedStatus || ""] ||
          "bg-gray-50 text-gray-600 border border-gray-200"
        }`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  // =========================================================
  // VIEW DETAILS MODAL
  // =========================================================

  const handleViewWalkin = (walkin: WalkinRecord) => {
    const details = [
      { label: "Customer Name", value: walkin.customerName },
      { label: "Phone Number", value: walkin.phoneNumber },
      { label: "Employee", value: walkin.employeeName },
      { label: "Service", value: walkin.serviceName },
      { label: "Category", value: walkin.category },
      { label: "Date", value: walkin.date },
      { label: "Time", value: walkin.time },
      { label: "Area / Branch", value: walkin.area },
      {
        label: "Price",
        value:
          walkin.price !== null && walkin.price !== undefined
            ? `₱${Number(walkin.price).toLocaleString()}`
            : null,
      },
      { label: "Appointment Type", value: walkin.appointmentType },
      { label: "Status", value: walkin.status },
      { label: "Notes", value: walkin.notes },
      {
        label: "Created At",
        value: walkin.createdAt
          ? new Date(walkin.createdAt).toLocaleString()
          : null,
      },
    ];

    const availableDetails = details.filter(
      (item) =>
        item.value !== null &&
        item.value !== undefined &&
        String(item.value).trim() !== ""
    );

    const detailsHtml = availableDetails
      .map(
        (item) => `
          <div
            style="
              display:flex;
              justify-content:space-between;
              align-items:flex-start;
              gap:20px;
              padding:11px 0;
              border-bottom:1px solid #f5e5ea;
              text-align:left;
            "
          >
            <span
              style="
                font-size:13px;
                font-weight:600;
                color:#92737c;
                flex-shrink:0;
              "
            >
              ${item.label}
            </span>

            <span
              style="
                font-size:14px;
                font-weight:500;
                color:#4b343b;
                text-align:right;
                word-break:break-word;
              "
            >
              ${String(item.value)}
            </span>
          </div>
        `
      )
      .join("");

    Swal.fire({
      title: "Walk-in Details",
      html: `
        <div style="width:100%; max-height:55vh; overflow-y:auto; padding:0 5px;">
          ${detailsHtml}
        </div>
      `,
      width: 650,
      confirmButtonText: "Close",
      confirmButtonColor: "#d77992",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl",
        title: "text-[#4b343b]",
        confirmButton: "rounded-lg",
      },
    });
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:p-6">
      {/* ========================================
          HEADER
      ======================================== */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#4b343b]">
            Recent Walk-ins
          </h2>

          <p className="mt-1 text-sm text-[#92737c]">
            {walkins.length} {walkins.length === 1 ? "record" : "records"}
          </p>
        </div>
      </div>

      {/* ========================================
          EMPTY STATE
      ======================================== */}
      {walkins.length === 0 ? (
        <div className="rounded-xl border border-dashed border-pink-200 bg-[#fffafb] p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f4] text-[#d77992]">
            <User size={22} />
          </div>

          <p className="font-semibold text-[#4b343b]">
            No walk-in records yet.
          </p>

          <p className="mt-1 text-sm text-[#92737c]">
            Recorded walk-in customers will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* ========================================
              MOBILE / TABLET: CARD LIST (below md)
          ======================================== */}
          <div className="flex flex-col gap-3 md:hidden">
            {paginatedWalkins.map((walkin) => (
              <div
                key={walkin.id}
                className="rounded-xl border border-pink-100 bg-[#fffafb] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f4] text-sm font-bold text-[#d77992]">
                      {walkin.customerName
                        ? walkin.customerName.charAt(0).toUpperCase()
                        : "?"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#4b343b]">
                        {walkin.customerName || "Unknown"}
                      </p>

                      {walkin.phoneNumber && (
                        <p className="mt-0.5 text-xs text-[#92737c]">
                          {walkin.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {getStatusBadge(walkin.status)}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div>
                    <p className="text-[#92737c]">Service</p>
                    <p className="truncate font-medium text-[#4b343b]">
                      {walkin.serviceName || "N/A"}
                    </p>
                  </div>

                  {walkin.category && (
                    <div>
                      <p className="text-[#92737c]">Category</p>
                      <span className="mt-0.5 inline-flex rounded-full bg-[#fff0f4] px-2 py-0.5 text-[11px] font-medium capitalize text-[#c15d78]">
                        {walkin.category}
                      </span>
                    </div>
                  )}

                  {walkin.area && (
                    <div>
                      <p className="text-[#92737c]">Area</p>
                      <div className="flex items-center gap-1 font-medium text-[#745d65]">
                        <MapPin size={12} />
                        <span className="truncate">{walkin.area}</span>
                      </div>
                    </div>
                  )}

                  {walkin.time && (
                    <div>
                      <p className="text-[#92737c]">Time</p>
                      <div className="flex items-center gap-1 font-medium text-[#745d65]">
                        <Clock size={12} />
                        <span>{walkin.time}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[#92737c]">Date</p>
                    <p className="font-medium text-[#745d65]">
                      {walkin.date || "N/A"}
                    </p>
                  </div>

                  {walkin.price !== null && walkin.price !== undefined && (
                    <div>
                      <p className="text-[#92737c]">Price</p>
                      <p className="font-bold text-[#c18c2d]">
                        ₱{Number(walkin.price).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleViewWalkin(walkin)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-pink-200 bg-white px-3 py-2 text-xs font-semibold text-[#c15d78] transition hover:border-pink-300 hover:bg-[#fff0f4]"
                >
                  <Eye size={14} />
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* ========================================
              DESKTOP: TABLE (md and up)
          ======================================== */}
          <div className="hidden overflow-x-auto rounded-xl border border-pink-100 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fff8fa]">
                <tr className="border-b border-pink-100">
                  <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                    Customer
                  </th>
                  <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                    Service
                  </th>
                  <th className="hidden px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#92737c] lg:table-cell">
                    Category
                  </th>
                  <th className="hidden px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#92737c] lg:table-cell">
                    Area
                  </th>
                  <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                    Date
                  </th>
                  <th className="hidden px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#92737c] xl:table-cell">
                    Time
                  </th>
                  <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                    Price
                  </th>
                  <th className="px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                    Status
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-[#92737c]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-pink-50">
                {paginatedWalkins.map((walkin) => (
                  <tr
                    key={walkin.id}
                    className="transition hover:bg-[#fffafb]"
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0f4] text-xs font-bold text-[#d77992]">
                          {walkin.customerName
                            ? walkin.customerName.charAt(0).toUpperCase()
                            : "?"}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[140px] truncate font-semibold text-[#4b343b]">
                            {walkin.customerName || "Unknown"}
                          </p>

                          {walkin.phoneNumber && (
                            <p className="mt-0.5 truncate text-xs text-[#92737c]">
                              {walkin.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2.5">
                      <p className="max-w-[140px] truncate font-medium text-[#4b343b]">
                        {walkin.serviceName || "N/A"}
                      </p>
                    </td>

                    <td className="hidden px-3 py-2.5 lg:table-cell">
                      {walkin.category && (
                        <span className="inline-flex rounded-full bg-[#fff0f4] px-2 py-1 text-xs font-medium capitalize text-[#c15d78]">
                          {walkin.category}
                        </span>
                      )}
                    </td>

                    <td className="hidden px-3 py-2.5 lg:table-cell">
                      {walkin.area && (
                        <div className="flex items-center gap-1 text-[#745d65]">
                          <MapPin size={13} />
                          <span className="max-w-[100px] truncate">
                            {walkin.area}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-2.5 text-[#745d65]">
                      {walkin.date || "N/A"}
                    </td>

                    <td className="hidden px-3 py-2.5 xl:table-cell">
                      {walkin.time && (
                        <div className="flex items-center gap-1 text-[#745d65]">
                          <Clock size={13} />
                          <span>{walkin.time}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {walkin.price !== null && walkin.price !== undefined && (
                        <p className="whitespace-nowrap font-bold text-[#c18c2d]">
                          ₱{Number(walkin.price).toLocaleString()}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      {getStatusBadge(walkin.status)}
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleViewWalkin(walkin)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-pink-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#c15d78] transition hover:border-pink-300 hover:bg-[#fff0f4]"
                      >
                        <Eye size={13} />
                        <span className="hidden xl:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ========================================
              PAGINATION
          ======================================== */}
          {totalPages > 1 && (
            <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-[#92737c]">
                Showing {rangeStart}–{rangeEnd} of {walkins.length}
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
                  page === "ellipsis" ? (
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
                          ? "bg-[#d77992] text-white"
                          : "border border-pink-200 bg-white text-[#745d65] hover:bg-[#fff0f4]"
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
};

export default RecentWalkins;