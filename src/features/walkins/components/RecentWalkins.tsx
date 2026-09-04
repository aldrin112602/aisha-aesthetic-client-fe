import React from "react";
import Swal from "sweetalert2";
import { Clock, Eye, MapPin, User } from "lucide-react";
import type { WalkinRecord, RecentWalkinsProps } from "../../../types";

const RecentWalkins: React.FC<RecentWalkinsProps> = ({ walkins }) => {

  const getStatusBadge = (status: string | null) => {
    const normalizedStatus = status?.toLowerCase();

    const statusStyles: Record<string, string> = {
      completed:
        "bg-green-50 text-green-700 border border-green-200",
      pending:
        "bg-yellow-50 text-yellow-700 border border-yellow-200",
      cancelled:
        "bg-red-50 text-red-700 border border-red-200",
      confirmed:
        "bg-blue-50 text-blue-700 border border-blue-200",
      ongoing:
        "bg-purple-50 text-purple-700 border border-purple-200",
    };

    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
          statusStyles[normalizedStatus || ""] ||
          "bg-gray-50 text-gray-600 border border-gray-200"
        }`}
      >
        {status || "Unknown"}
      </span>
    );
  };


  const handleViewWalkin = (walkin: WalkinRecord) => {
    const details = [
      {
        label: "Customer Name",
        value: walkin.customerName,
      },
      {
        label: "Phone Number",
        value: walkin.phoneNumber,
      },
      {
        label: "Employee",
        value: walkin.employeeName,
      },
      {
        label: "Service ID",
        value: walkin.serviceId,
      },
      {
        label: "Service",
        value: walkin.serviceName,
      },
      {
        label: "Category",
        value: walkin.category,
      },
      {
        label: "Date",
        value: walkin.date,
      },
      {
        label: "Time",
        value: walkin.time,
      },
      {
        label: "Area / Branch",
        value: walkin.area,
      },
      {
        label:
          "Price",
        value:
          walkin.price !== null && walkin.price !== undefined
            ? `₱${Number(walkin.price).toLocaleString()}`
            : null,
      },
      {
        label: "Appointment Type",
        value: walkin.appointmentType,
      },
      {
        label: "Status",
        value: walkin.status,
      },
      {
        label: "Notes",
        value: walkin.notes,
      },
      {
        label: "Created At",
        value: walkin.createdAt
          ? new Date(walkin.createdAt).toLocaleString()
          : null,
      },
    ];

    // ========================================
    // REMOVE NULL / EMPTY DATA
    // ========================================
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
        <div
          style="
            width:100%;
            max-height:55vh;
            overflow-y:auto;
            padding:0 5px;
          "
        >
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
    <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">

      {/* ========================================
          HEADER
      ======================================== */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#4b343b]">
            Recent Walk-ins
          </h2>

          <p className="mt-1 text-sm text-[#92737c]">
            {walkins.length}{" "}
            {walkins.length === 1 ? "record" : "records"}
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

        /* ========================================
           TABLE
        ======================================== */
        <div className="overflow-x-auto rounded-xl border border-pink-100">

          <table className="w-full min-w-[900px] text-left">

            <thead className="bg-[#fff8fa]">
              <tr className="border-b border-pink-100">

                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Customer
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Service
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Category
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Area
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Date
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Time
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Price
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Status
                </th>

                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-[#92737c]">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-pink-50">

              {walkins.map((walkin) => (

                <tr
                  key={walkin.id}
                  className="transition hover:bg-[#fffafb]"
                >

                  {/* CUSTOMER */}
                  <td className="px-4 py-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f4] text-sm font-bold text-[#d77992]">
                        {walkin.customerName
                          ? walkin.customerName
                              .charAt(0)
                              .toUpperCase()
                          : "?"}
                      </div>

                      <div className="min-w-0">

                        <p className="max-w-[180px] truncate text-sm font-semibold text-[#4b343b]">
                          {walkin.customerName || "Unknown"}
                        </p>

                        {walkin.phoneNumber && (
                          <p className="mt-0.5 text-xs text-[#92737c]">
                            {walkin.phoneNumber}
                          </p>
                        )}

                      </div>

                    </div>

                  </td>

                  {/* SERVICE */}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#4b343b]">
                      {walkin.serviceName || "N/A"}
                    </p>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-4 py-3">

                    {walkin.category && (
                      <span className="inline-flex rounded-full bg-[#fff0f4] px-2.5 py-1 text-xs font-medium capitalize text-[#c15d78]">
                        {walkin.category}
                      </span>
                    )}

                  </td>

                  {/* AREA */}
                  <td className="px-4 py-3">

                    {walkin.area && (
                      <div className="flex items-center gap-1.5 text-sm text-[#745d65]">
                        <MapPin size={14} />
                        <span>{walkin.area}</span>
                      </div>
                    )}

                  </td>

                  {/* DATE */}
                  <td className="px-4 py-3">
                    <p className="text-sm text-[#745d65]">
                      {walkin.date || "N/A"}
                    </p>
                  </td>

                  {/* TIME */}
                  <td className="px-4 py-3">

                    {walkin.time && (
                      <div className="flex items-center gap-1.5 text-sm text-[#745d65]">
                        <Clock size={14} />
                        <span>{walkin.time}</span>
                      </div>
                    )}

                  </td>

                  {/* PRICE */}
                  <td className="px-4 py-3">

                    {walkin.price !== null &&
                      walkin.price !== undefined && (
                        <p className="whitespace-nowrap text-sm font-bold text-[#c18c2d]">
                          ₱{Number(walkin.price).toLocaleString()}
                        </p>
                      )}

                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    {getStatusBadge(walkin.status)}
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3 text-center">

                    <button
                      type="button"
                      onClick={() => handleViewWalkin(walkin)}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-pink-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-[#c15d78]
                        transition
                        hover:border-pink-300
                        hover:bg-[#fff0f4]
                      "
                    >
                      <Eye size={14} />
                      View Details
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default RecentWalkins;