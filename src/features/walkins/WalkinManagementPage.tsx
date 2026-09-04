import { useCallback, useEffect, useState } from 'react';
import {
  Clock,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  X,
} from 'lucide-react';
import Swal from 'sweetalert2';

import { getServices } from '../../api/services.api';
import { getShopAreas } from '../../api/shopAreas.api';
import { createWalkin, getWalkins } from '../../api/walkins.api';
import type { Service, ShopArea, WalkinRecord } from '../../types';
import { getCurrentUser } from '../../utils/auth';
import RecentWalkins from './components/RecentWalkins';

const defaultFormData = {
  name: '',
  phoneNumber: '',
  serviceId: '',
  serviceName: '',
  category: '',
  area: '',
  price: 0,
  notes: '',
};

function WalkinManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [walkins, setWalkins] = useState<WalkinRecord[]>([]);
  const [shopAreas, setShopAreas] = useState<ShopArea[]>([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [servicesLoading, setServicesLoading] = useState(true);
  const [shopAreasLoading, setShopAreasLoading] = useState(true);

  const [formData, setFormData] = useState(defaultFormData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========================================================
  // FETCH SERVICES
  // =========================================================

  const fetchServices = useCallback(async () => {
    try {
      setServicesLoading(true);

      const data = await getServices();

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch services:', error);

      setServices([]);

      await Swal.fire({
        icon: 'error',
        title: 'Unable to Load Services',
        text: 'There was a problem loading the available services.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
      });
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // =========================================================
  // FETCH WALK-INS
  // =========================================================

  const fetchWalkins = useCallback(async () => {
    try {
      const data = await getWalkins();

      setWalkins(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch walk-ins:', error);

      setWalkins([]);

      await Swal.fire({
        icon: 'error',
        title: 'Unable to Load Walk-ins',
        text: 'There was a problem loading the walk-in records.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
      });
    }
  }, []);

  // =========================================================
  // FETCH SHOP AREAS
  // =========================================================

  const fetchShopAreas = useCallback(async () => {
    try {
      setShopAreasLoading(true);

      const data = await getShopAreas();

      const areas = Array.isArray(data) ? data : [];

      setShopAreas(areas);

      setFormData((current) => ({
        ...current,
        area: current.area || areas[0]?.name || '',
      }));
    } catch (error) {
      console.error('Failed to fetch shop areas:', error);

      setShopAreas([]);

      await Swal.fire({
        icon: 'error',
        title: 'Unable to Load Shop Areas',
        text: 'There was a problem loading the available shop areas.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
      });
    } finally {
      setShopAreasLoading(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    queueMicrotask(() => {
      void fetchServices();
      void fetchWalkins();
      void fetchShopAreas();
    });
  }, [fetchServices, fetchWalkins, fetchShopAreas]);

  // =========================================================
  // MODAL OPEN / CLOSE
  // =========================================================

  const openAddWalkinModal = () => {
    setIsModalOpen(true);
  };

  const closeAddWalkinModal = () => {
    setIsModalOpen(false);
    setFormData({
      ...defaultFormData,
      area: shopAreas[0]?.name || '',
    });
  };

  // Close on Escape + lock background scroll while modal is open
  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAddWalkinModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === 'price' ? Number.parseInt(value, 10) || 0 : value,
    }));
  };

  // =========================================================
  // SERVICE CHANGE
  // =========================================================

  const handleServiceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedServiceId = event.target.value;

    if (!selectedServiceId) {
      setFormData((current) => ({
        ...defaultFormData,
        area: current.area || shopAreas[0]?.name || '',
      }));

      return;
    }

    const selectedService = services.find(
      (service) => String(service.id) === selectedServiceId
    );

    if (!selectedService) {
      return;
    }

    setFormData((current) => ({
      ...current,
      serviceId: selectedServiceId,
      serviceName: selectedService.name,
      category: selectedService.category,
      price: selectedService.price,
    }));
  };

  // =========================================================
  // REFRESH WALK-INS
  // =========================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchWalkins();

      await Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Walk-in records have been refreshed.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
        timer: 1500,
        timerProgressBar: true,
      });
    } finally {
      setRefreshing(false);
    }
  };

  // =========================================================
  // RECORD WALK-IN
  // =========================================================

  const handleRecordWalkin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!formData.name.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Customer Name Required',
        text: 'Please enter the customer name.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
      });

      return;
    }

    if (!formData.serviceName) {
      await Swal.fire({
        icon: 'warning',
        title: 'Service Required',
        text: 'Please select a service.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
      });

      return;
    }

    if (!formData.area) {
      await Swal.fire({
        icon: 'warning',
        title: 'Shop Area Required',
        text: 'Please select a shop area.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
      });

      return;
    }

    if (!formData.price || formData.price <= 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Invalid Price',
        text: 'The selected service must have a valid price.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
      });

      return;
    }

    // -------------------------------------------------------
    // CONFIRMATION
    // -------------------------------------------------------

    const confirmation = await Swal.fire({
      icon: 'question',
      title: 'Record Walk-in?',
      html: `
        <div style="
          text-align: left;
          background: #fff8fa;
          border-radius: 12px;
          padding: 14px 16px;
          margin-top: 10px;
        ">
          <p style="margin: 5px 0;">
            <strong>Customer:</strong> ${formData.name}
          </p>

          ${formData.phoneNumber
          ? `
                <p style="margin: 5px 0;">
                  <strong>Phone:</strong> ${formData.phoneNumber}
                </p>
              `
          : ''
        }

          <p style="margin: 5px 0;">
            <strong>Service:</strong> ${formData.serviceName}
          </p>

          <p style="margin: 5px 0;">
            <strong>Category:</strong> ${formData.category || 'N/A'}
          </p>

          <p style="margin: 5px 0;">
            <strong>Area:</strong> ${formData.area}
          </p>

          <p style="
            margin: 10px 0 5px;
            font-size: 18px;
            color: #c18c2d;
          ">
            <strong>Total: ₱${formData.price.toLocaleString()}</strong>
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Record It',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d77992',
      cancelButtonColor: '#9ca3af',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    // -------------------------------------------------------
    // SAVE
    // -------------------------------------------------------

    setLoading(true);

    try {
      const currentUser = getCurrentUser();

      const now = new Date();

      const currentDate = now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const currentTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Manila',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const data = await createWalkin({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || null,
        serviceId: formData.serviceId ? Number(formData.serviceId) : null,
        serviceName: formData.serviceName,
        category: formData.category,
        area: formData.area,
        price: formData.price,
        notes: formData.notes.trim(),
        employeeId: currentUser?.id || null,
        date: currentDate,
        time: currentTime,
      });

      // Add new record to the beginning of the list
      setWalkins((current) => [data, ...current]);

      // Reset form but preserve first shop area, then close the modal
      setFormData({
        ...defaultFormData,
        area: shopAreas[0]?.name || '',
      });

      setIsModalOpen(false);

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      await Swal.fire({
        icon: 'success',
        title: 'Walk-in Recorded!',
        html: `
          <p style="margin-bottom: 8px;">
            The walk-in customer has been recorded successfully.
          </p>

          <p style="color: #92737c;">
            ${data.serviceName} • ₱${data?.price?.toLocaleString()}
          </p>
        `,
        confirmButtonText: 'Done',
        confirmButtonColor: '#d77992',
      });
    } catch (error) {
      console.error('Failed to record walk-in:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while recording the walk-in.';

      // -----------------------------------------------------
      // ERROR
      // -----------------------------------------------------

      await Swal.fire({
        icon: 'error',
        title: 'Failed to Record Walk-in',
        text: message,
        confirmButtonText: 'Okay',
        confirmButtonColor: '#d77992',
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase().trim();

    if (
      normalizedStatus === 'completed' ||
      normalizedStatus === 'complete'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf9f1] px-2.5 py-1 text-xs font-semibold text-[#2f7d59]">
          <CheckCircle2 size={13} />
          {status}
        </span>
      );
    }

    if (
      normalizedStatus === 'cancelled' ||
      normalizedStatus === 'canceled'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500">
          <AlertCircle size={13} />
          {status}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4e5] px-2.5 py-1 text-xs font-semibold text-[#b87918]">
        <Clock size={13} />
        {status || 'Pending'}
      </span>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="page-container">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Walk-in Management</h1>

          <p className="page-subtitle">
            Record walk-in customers and complete services on the spot.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#d77992] transition hover:bg-[#fff7f9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? 'animate-spin' : ''}
            />

            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            type="button"
            onClick={openAddWalkinModal}
            className="primary-btn inline-flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Walk-in
          </button>
        </div>
      </div>

      {/* =====================================================
          RECORD NEW WALK-IN — MODAL
      ====================================================== */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeAddWalkinModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#4b343b]">
                Record New Walk-in
              </h2>

              <button
                type="button"
                onClick={closeAddWalkinModal}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#92737c] transition hover:bg-[#fff0f4] hover:text-[#d77992]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordWalkin} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">

            {/* CUSTOMER NAME */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5d444c]">
                <User size={16} className="text-[#c18c2d]" />
                Customer Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Enter customer name"
                required
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5d444c]">
                <Phone size={16} className="text-[#c18c2d]" />
                Phone Number
              </label>

              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="09XX-XXX-XXXX"
              />
            </div>

            {/* SERVICE */}
            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">
                Service *
              </label>

              {servicesLoading ? (
                <div className="input-field w-full text-[#999]">
                  Loading services...
                </div>
              ) : (
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleServiceChange}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select a service</option>

                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} (₱{service.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field w-full bg-[#f9f9f9]"
                placeholder="Auto-filled from service"
                disabled
              />
            </div>

            {/* SHOP AREA */}
            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">
                Shop Area *
              </label>

              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="input-field w-full"
                disabled={
                  shopAreasLoading || shopAreas.length === 0
                }
              >
                {shopAreasLoading ? (
                  <option value="">Loading shop areas...</option>
                ) : shopAreas.length === 0 ? (
                  <option value="">No shop area available</option>
                ) : (
                  shopAreas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* PRICE */}
            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">
                Price (₱) *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field w-full bg-[#f9f9f9]"
                placeholder="0"
                disabled
              />
            </div>
          </div>

          {/* NOTES */}
          <div>
            <label className="mb-2 text-sm font-semibold text-[#5d444c]">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="input-field w-full resize-none"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="primary-btn mt-6 inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                Recording...
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                Record Walk-in
              </>
            )}
          </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          RECENT WALK-INS
      ====================================================== */}
      <RecentWalkins walkins={walkins} />


    </div>
  );
}

export default WalkinManagement;