import { useCallback, useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Edit2,
  Trash2,
  X,
  Plus,
  AlertCircle,
  Check,
} from 'lucide-react';

import {
  createShopArea,
  deleteShopArea,
  getShopAreas,
  updateShopArea,
} from '../../api/shopAreas.api';
import type { ShopArea } from '../../types';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function AdminShopareas() {
  const [areas, setAreas] = useState<ShopArea[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<ShopArea | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    operatingHours: '',
    operatingDays: [] as string[],
    openingTime: '09:00',
    closingTime: '18:00',
  });

  // ============================================================
  // FETCH SHOP AREAS
  // ============================================================

  const fetchAreas = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getShopAreas();

      setAreas(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load shop areas'
      );
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchAreas();
    });
  }, [fetchAreas]);

  // ============================================================
  // TIME FORMAT
  // ============================================================

  const formatTime = (time: string) => {
    if (!time) return '';

    const [hours, minutes] = time.split(':');
    const hour = Number(hours);

    if (Number.isNaN(hour)) return time;

    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${period}`;
  };

  // ============================================================
  // GENERATE OPERATING HOURS STRING
  // ============================================================

  const generateOperatingHours = (
    selectedDays: string[],
    openingTime: string,
    closingTime: string
  ) => {
    if (selectedDays.length === 0) {
      return '';
    }

    const orderedDays = DAYS.filter((day) => selectedDays.includes(day));

    // Monday-Friday
    const dayText = (() => {
      if (
      orderedDays.length === 5 &&
      orderedDays.every((day) =>
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)
      )
    ) {
        return 'Monday - Friday';
      }

    // Monday-Saturday
      if (
      orderedDays.length === 6 &&
      orderedDays.every((day) =>
        [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ].includes(day)
      )
    ) {
        return 'Monday - Saturday';
      }

    // Everyday
      if (orderedDays.length === 7) {
        return 'Everyday';
      }

    // Custom days
      return orderedDays.join(', ');
    })();

    const timeText =
      openingTime && closingTime
        ? ` • ${formatTime(openingTime)} - ${formatTime(closingTime)}`
        : '';

    return `${dayText}${timeText}`;
  };

  // ============================================================
  // HANDLE OPEN MODAL
  // ============================================================

  const handleOpenModal = (area?: ShopArea) => {
    if (area) {
      setIsEditing(true);
      setEditingId(area.id);

      /*
       * If backend already supports structured fields,
       * use them.
       *
       * Otherwise, try to determine the schedule from
       * the existing operatingHours string.
       */

      let operatingDays: string[] = area.operatingDays || [];
      let openingTime = area.openingTime || '09:00';
      let closingTime = area.closingTime || '18:00';

      // Existing backend compatibility
      if (!area.operatingDays && area.operatingHours) {
        const hours = area.operatingHours.toLowerCase();

        if (
          hours.includes('monday - friday') ||
          hours.includes('mon-fri') ||
          hours.includes('monday to friday') ||
          hours.includes('mon to fri')
        ) {
          operatingDays = DAYS.slice(0, 5);
        } else if (
          hours.includes('monday - saturday') ||
          hours.includes('mon-sat') ||
          hours.includes('monday to saturday')
        ) {
          operatingDays = DAYS.slice(0, 6);
        } else if (
          hours.includes('everyday') ||
          hours.includes('monday - sunday') ||
          hours.includes('mon-sun')
        ) {
          operatingDays = [...DAYS];
        } else {
          operatingDays = DAYS.filter((day) =>
            hours.includes(day.toLowerCase())
          );
        }

        // Try to read AM/PM time from existing string
        const timeMatches = area.operatingHours.match(
          /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i
        );

        if (timeMatches) {
          const openHour = Number(timeMatches[1]);
          const openMinutes = timeMatches[2] || '00';
          const openPeriod = timeMatches[3].toUpperCase();

          const closeHour = Number(timeMatches[4]);
          const closeMinutes = timeMatches[5] || '00';
          const closePeriod = timeMatches[6].toUpperCase();

          let convertedOpenHour = openHour;

          if (openPeriod === 'PM' && openHour !== 12) {
            convertedOpenHour += 12;
          }

          if (openPeriod === 'AM' && openHour === 12) {
            convertedOpenHour = 0;
          }

          let convertedCloseHour = closeHour;

          if (closePeriod === 'PM' && closeHour !== 12) {
            convertedCloseHour += 12;
          }

          if (closePeriod === 'AM' && closeHour === 12) {
            convertedCloseHour = 0;
          }

          openingTime = `${String(convertedOpenHour).padStart(
            2,
            '0'
          )}:${openMinutes}`;

          closingTime = `${String(convertedCloseHour).padStart(
            2,
            '0'
          )}:${closeMinutes}`;
        }
      }

      setFormData({
        name: area.name || '',
        address: area.address || '',
        contact: area.contact || '',
        operatingHours: area.operatingHours || '',
        operatingDays,
        openingTime,
        closingTime,
      });
    } else {
      setIsEditing(false);
      setEditingId(null);

      setFormData({
        name: '',
        address: '',
        contact: '',
        operatingHours: '',
        operatingDays: [],
        openingTime: '09:00',
        closingTime: '18:00',
      });
    }

    setShowModal(true);
    setError('');
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // TOGGLE DAY
  // ============================================================

  const toggleDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.operatingDays.includes(day);

      const operatingDays = exists
        ? prev.operatingDays.filter((item) => item !== day)
        : [...prev.operatingDays, day];

      return {
        ...prev,
        operatingDays,
        operatingHours: generateOperatingHours(
          operatingDays,
          prev.openingTime,
          prev.closingTime
        ),
      };
    });
  };

  // ============================================================
  // QUICK SELECT
  // ============================================================

  const selectWeekdays = () => {
    const selectedDays = DAYS.slice(0, 5);

    setFormData((prev) => ({
      ...prev,
      operatingDays: selectedDays,
      operatingHours: generateOperatingHours(
        selectedDays,
        prev.openingTime,
        prev.closingTime
      ),
    }));
  };

  const selectMondaySaturday = () => {
    const selectedDays = DAYS.slice(0, 6);

    setFormData((prev) => ({
      ...prev,
      operatingDays: selectedDays,
      operatingHours: generateOperatingHours(
        selectedDays,
        prev.openingTime,
        prev.closingTime
      ),
    }));
  };

  const selectEveryday = () => {
    const selectedDays = [...DAYS];

    setFormData((prev) => ({
      ...prev,
      operatingDays: selectedDays,
      operatingHours: generateOperatingHours(
        selectedDays,
        prev.openingTime,
        prev.closingTime
      ),
    }));
  };

  const clearDays = () => {
    setFormData((prev) => ({
      ...prev,
      operatingDays: [],
      operatingHours: '',
    }));
  };

  // ============================================================
  // TIME CHANGE
  // ============================================================

  const handleOpeningTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      openingTime: value,
      operatingHours: generateOperatingHours(
        prev.operatingDays,
        value,
        prev.closingTime
      ),
    }));
  };

  const handleClosingTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      closingTime: value,
      operatingHours: generateOperatingHours(
        prev.operatingDays,
        prev.openingTime,
        value
      ),
    }));
  };

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.address.trim()) {
      setError(
        'Please fill in all required fields (Name and Exact Location)'
      );
      setIsSubmitting(false);
      return;
    }

    if (formData.operatingDays.length === 0) {
      setError('Please select at least one operating day.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.openingTime || !formData.closingTime) {
      setError('Please select both opening and closing time.');
      setIsSubmitting(false);
      return;
    }

    if (formData.openingTime >= formData.closingTime) {
      setError('Closing time must be later than opening time.');
      setIsSubmitting(false);
      return;
    }

    const operatingHours = generateOperatingHours(
      formData.operatingDays,
      formData.openingTime,
      formData.closingTime
    );

    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        contact: formData.contact.trim(),
        operatingHours,
        operatingDays: formData.operatingDays,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        status: 'active',
      };

      const result =
        isEditing && editingId
          ? await updateShopArea(editingId, payload)
          : await createShopArea(payload);

      if (isEditing) {
        setAreas((prev) =>
          prev.map((area) =>
            area.id === editingId
              ? {
                  ...result,
                  operatingHours:
                    result.operatingHours || operatingHours,
                  operatingDays:
                    result.operatingDays || formData.operatingDays,
                  openingTime:
                    result.openingTime || formData.openingTime,
                  closingTime:
                    result.closingTime || formData.closingTime,
                }
              : area
          )
        );

        setSuccess('Shop area updated successfully!');
      } else {
        setAreas((prev) => [
          ...prev,
          {
            ...result,
            operatingHours:
              result.operatingHours || operatingHours,
            operatingDays:
              result.operatingDays || formData.operatingDays,
            openingTime:
              result.openingTime || formData.openingTime,
            closingTime:
              result.closingTime || formData.closingTime,
          },
        ]);

        setSuccess('Shop area created successfully!');
      }

      setShowModal(false);

      setFormData({
        name: '',
        address: '',
        contact: '',
        operatingHours: '',
        operatingDays: [],
        openingTime: '09:00',
        closingTime: '18:00',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDeleteClick = (area: ShopArea) => {
    setDeleteTarget(area);
    setError('');
  };

  const deleteArea = async () => {
    if (!deleteTarget) return;

    setIsSubmitting(true);
    setError('');

    try {
      await deleteShopArea(deleteTarget.id);

      // Remove the deleted area from the current UI immediately.
      setAreas((prev) =>
        prev.filter((area) => area.id !== deleteTarget.id)
      );

      const deletedName = deleteTarget.name;

      // Close the confirmation modal.
      setDeleteTarget(null);

      // Show success message.
      setSuccess(`"${deletedName}" has been deleted successfully.`);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete shop area'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // QUICK BUTTON ACTIVE CHECK
  // ============================================================

  const isSameDays = (days: string[]) => {
    if (formData.operatingDays.length !== days.length) {
      return false;
    }

    return days.every((day) =>
      formData.operatingDays.includes(day)
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Shop Areas</h1>

          <p className="page-subtitle">
            Manage your shop branches, locations, and operating schedules.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#c18c2d] hover:bg-[#b07720] px-4 py-3 font-semibold text-white transition-colors w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Shop Area
        </button>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          ✓ {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex gap-2 items-start text-sm text-red-700">
          <AlertCircle
            size={18}
            className="flex-shrink-0 mt-0.5"
          />

          <span>{error}</span>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-sm text-[#92737c]">
          Loading shop areas...
        </div>
      ) : areas.length === 0 ? (
        /* EMPTY */
        <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-8 text-center">
          <MapPin
            size={40}
            className="mx-auto mb-3 text-[#c18c2d]"
          />

          <p className="text-sm text-[#92737c]">
            No shop areas yet.
          </p>

          <button
            onClick={() => handleOpenModal()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#c18c2d] hover:bg-[#b07720] px-4 py-2 font-semibold text-white transition-colors"
          >
            <Plus size={18} />
            Create First Area
          </button>
        </div>
      ) : (
        /* AREAS */
        <div className="grid gap-4 md:grid-cols-2">
          {areas.map((area) => (
            <div
              key={area.id}
              className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#4b343b]">
                  {area.name}
                </h3>

                <span
                  className={`inline-block mt-2 rounded-full px-2 py-1 text-xs font-semibold uppercase ${
                    area.status === 'active'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {area.status}
                </span>
              </div>

              <div className="space-y-3 text-sm text-[#80656d]">

                {/* ADDRESS */}
                {area.address && (
                  <div className="flex gap-3 items-start">
                    <MapPin
                      size={16}
                      className="text-[#c18c2d] flex-shrink-0 mt-0.5"
                    />

                    <div>
                      <p className="font-semibold text-[#4b343b]">
                        Exact Location
                      </p>

                      <p>{area.address}</p>
                    </div>
                  </div>
                )}

                {/* CONTACT */}
                {area.contact && (
                  <div className="flex gap-3 items-start">
                    <Phone
                      size={16}
                      className="text-[#c18c2d] flex-shrink-0 mt-0.5"
                    />

                    <div>
                      <p className="font-semibold text-[#4b343b]">
                        Contact
                      </p>

                      <p>{area.contact}</p>
                    </div>
                  </div>
                )}

                {/* OPERATING HOURS */}
                {area.operatingHours && (
                  <div className="flex gap-3 items-start">
                    <Clock
                      size={16}
                      className="text-[#c18c2d] flex-shrink-0 mt-0.5"
                    />

                    <div>
                      <p className="font-semibold text-[#4b343b]">
                        Operating Hours
                      </p>

                      <p>{area.operatingHours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => handleOpenModal(area)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#fff5f8] hover:bg-[#ffd4e0] px-3 py-2 font-semibold text-[#4b343b] transition-colors"
                >
                  <Edit2 size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteClick(area)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 px-3 py-2 font-semibold text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">

          <div className="rounded-3xl bg-white max-w-lg w-full shadow-2xl max-h-[92vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#fff5f8] px-6 py-4 border-b border-pink-100">

              <h2 className="text-lg font-bold text-[#4b343b]">
                {isEditing
                  ? 'Edit Shop Area'
                  : 'Add New Shop Area'}
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#92737c] hover:text-[#4b343b]"
              >
                <X size={24} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* FORM ERROR */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* NAME */}
              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">
                  Shop Area Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Branch - Area A"
                  className="w-full rounded-lg border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d]"
                  required
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">
                  Exact Location (Address) *
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main Street, Building A, Ground Floor, City"
                  rows={3}
                  className="w-full rounded-lg border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d] resize-none"
                  required
                />
              </div>

              {/* CONTACT */}
              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">
                  Contact Number
                </label>

                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="e.g., 0917 123 4567"
                  className="w-full rounded-lg border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d]"
                />
              </div>

              {/* ==================================================
                  OPERATING DAYS
              ================================================== */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#4b343b]">
                    Operating Days *
                  </label>

                  <button
                    type="button"
                    onClick={clearDays}
                    className="text-xs font-semibold text-[#c18c2d] hover:underline"
                  >
                    Clear
                  </button>
                </div>

                {/* QUICK SELECT */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">

                  <button
                    type="button"
                    onClick={selectWeekdays}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      isSameDays(DAYS.slice(0, 5))
                        ? 'border-[#c18c2d] bg-[#fff5e6] text-[#9b6d1e]'
                        : 'border-pink-200 bg-white text-[#80656d] hover:bg-[#fff5f8]'
                    }`}
                  >
                    Monday - Friday
                  </button>

                  <button
                    type="button"
                    onClick={selectMondaySaturday}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      isSameDays(DAYS.slice(0, 6))
                        ? 'border-[#c18c2d] bg-[#fff5e6] text-[#9b6d1e]'
                        : 'border-pink-200 bg-white text-[#80656d] hover:bg-[#fff5f8]'
                    }`}
                  >
                    Mon - Sat
                  </button>

                  <button
                    type="button"
                    onClick={selectEveryday}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      isSameDays(DAYS)
                        ? 'border-[#c18c2d] bg-[#fff5e6] text-[#9b6d1e]'
                        : 'border-pink-200 bg-white text-[#80656d] hover:bg-[#fff5f8]'
                    }`}
                  >
                    Everyday
                  </button>

                  <button
                    type="button"
                    onClick={clearDays}
                    className="rounded-lg border border-pink-200 bg-white px-3 py-2 text-xs font-semibold text-[#80656d] hover:bg-[#fff5f8] transition-colors"
                  >
                    Custom
                  </button>

                </div>

                {/* DAYS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                  {DAYS.map((day) => {
                    const selected =
                      formData.operatingDays.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                          selected
                            ? 'border-[#c18c2d] bg-[#fff5e6] text-[#4b343b]'
                            : 'border-pink-200 bg-white text-[#80656d] hover:bg-[#fff5f8]'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            selected
                              ? 'border-[#c18c2d] bg-[#c18c2d] text-white'
                              : 'border-pink-300 bg-white'
                          }`}
                        >
                          {selected && <Check size={13} />}
                        </span>

                        <span className="text-xs font-medium">
                          {day}
                        </span>
                      </button>
                    );
                  })}

                </div>

                {/* SELECTED DAYS */}
                {formData.operatingDays.length > 0 && (
                  <p className="mt-2 text-xs text-[#92737c]">
                    Selected:{' '}
                    <span className="font-semibold text-[#4b343b]">
                      {DAYS.filter((day) =>
                        formData.operatingDays.includes(day)
                      ).join(', ')}
                    </span>
                  </p>
                )}
              </div>

              {/* ==================================================
                  OPENING / CLOSING TIME
              ================================================== */}

              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">
                  Operating Time *
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* OPENING */}
                  <div>
                    <label className="block text-xs text-[#92737c] mb-1">
                      Opening Time
                    </label>

                    <input
                      type="time"
                      value={formData.openingTime}
                      onChange={handleOpeningTimeChange}
                      className="w-full rounded-lg border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d]"
                      required
                    />
                  </div>

                  {/* CLOSING */}
                  <div>
                    <label className="block text-xs text-[#92737c] mb-1">
                      Closing Time
                    </label>

                    <input
                      type="time"
                      value={formData.closingTime}
                      onChange={handleClosingTimeChange}
                      className="w-full rounded-lg border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d]"
                      required
                    />
                  </div>

                </div>
              </div>

              {/* ==================================================
                  SCHEDULE PREVIEW
              ================================================== */}

              <div className="rounded-xl border border-[#e9d3a8] bg-[#fffaf0] p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#f5e6c8]">
                    <Clock
                      size={18}
                      className="text-[#c18c2d]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                      Schedule Preview
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#4b343b]">
                      {formData.operatingDays.length > 0
                        ? generateOperatingHours(
                            formData.operatingDays,
                            formData.openingTime,
                            formData.closingTime
                          )
                        : 'No operating days selected'}
                    </p>
                  </div>

                </div>

              </div>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div className="flex gap-3 pt-4 border-t border-pink-100">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2.5 font-semibold text-[#4b343b] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-[#c18c2d] hover:bg-[#b07720] px-4 py-2.5 font-semibold text-white disabled:opacity-50 transition-colors"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : isEditing
                    ? 'Update Area'
                    : 'Create Area'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
      ======================================================== */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="border-b border-pink-100 bg-[#fff5f8] px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Trash2
                    size={22}
                    className="text-red-600"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#4b343b]">
                    Delete Shop Area?
                  </h2>

                  <p className="mt-1 text-sm text-[#80656d]">
                    Are you sure you want to delete this shop area?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isSubmitting}
                  className="text-[#92737c] transition-colors hover:text-[#4b343b] disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="px-6 py-5">
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
                <p className="text-xs font-medium text-red-600">
                  You are about to delete:
                </p>

                <p className="mt-1 break-words text-base font-bold text-[#4b343b]">
                  "{deleteTarget.name}"
                </p>

                <p className="mt-2 text-xs text-red-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 border-t border-pink-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-semibold text-[#4b343b] transition-colors hover:bg-[#fff5f8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                No
              </button>

              <button
                type="button"
                onClick={deleteArea}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminShopareas;
