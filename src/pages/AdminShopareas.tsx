import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, Edit2, Trash2, X, Plus, AlertCircle } from 'lucide-react';

interface ShopArea {
  id: number;
  name: string;
  address: string;
  contact: string;
  operatingHours: string;
  status: string;
}

function AdminShopareas() {
  const [areas, setAreas] = useState<ShopArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    operatingHours: '',
  });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/shop-areas`);
      const data = await response.json();
      setAreas(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load shop areas');
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (area?: ShopArea) => {
    if (area) {
      setIsEditing(true);
      setEditingId(area.id);
      setFormData({
        name: area.name,
        address: area.address,
        contact: area.contact,
        operatingHours: area.operatingHours,
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        name: '',
        address: '',
        contact: '',
        operatingHours: '',
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Please fill in all required fields (Name and Exact Location)');
      setIsSubmitting(false);
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${apiBaseUrl}/api/shop-areas/${editingId}`
        : `${apiBaseUrl}/api/shop-areas`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'active',
        }),
      });

      if (!response.ok) {
        throw new Error(isEditing ? 'Failed to update shop area' : 'Failed to create shop area');
      }

      const result = await response.json();

      if (isEditing) {
        setAreas((prev) =>
          prev.map((area) => (area.id === editingId ? result : area))
        );
        setSuccess('Shop area updated successfully!');
      } else {
        setAreas((prev) => [...prev, result]);
        setSuccess('Shop area created successfully!');
      }

      setShowModal(false);
      setFormData({ name: '', address: '', contact: '', operatingHours: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (area: ShopArea) => {
    setConfirmAction({
      title: 'Delete Shop Area?',
      message: `Are you sure you want to delete "${area.name}"? This action cannot be undone.`,
      action: () => deleteArea(area.id),
    });
  };

  const deleteArea = async (id: number) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/shop-areas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete shop area');
      }

      setAreas((prev) => prev.filter((area) => area.id !== id));
      setSuccess('Shop area deleted successfully!');
      setConfirmAction(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Shop Areas</h1>
          <p className="page-subtitle">Manage your shop branches and exact locations.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#c18c2d] hover:bg-[#b07720] px-4 py-3 font-semibold text-white transition-colors w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Shop Area
        </button>
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

      {loading ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-sm text-[#92737c]">
          Loading shop areas...
        </div>
      ) : areas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-8 text-center">
          <MapPin size={40} className="mx-auto mb-3 text-[#c18c2d]" />
          <p className="text-sm text-[#92737c]">No shop areas yet.</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#c18c2d] hover:bg-[#b07720] px-4 py-2 font-semibold text-white transition-colors"
          >
            <Plus size={18} />
            Create First Area
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {areas.map((area) => (
            <div
              key={area.id}
              className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#4b343b]">{area.name}</h3>
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
                {area.address && (
                  <div className="flex gap-3 items-start">
                    <MapPin size={16} className="text-[#c18c2d] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#4b343b]">Exact Location</p>
                      <p>{area.address}</p>
                    </div>
                  </div>
                )}

                {area.contact && (
                  <div className="flex gap-3 items-start">
                    <Phone size={16} className="text-[#c18c2d] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#4b343b]">Contact</p>
                      <p>{area.contact}</p>
                    </div>
                  </div>
                )}

                {area.operatingHours && (
                  <div className="flex gap-3 items-start">
                    <Clock size={16} className="text-[#c18c2d] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#4b343b]">Operating Hours</p>
                      <p>{area.operatingHours}</p>
                    </div>
                  </div>
                )}
              </div>

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

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
          <div className="rounded-3xl bg-white max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between bg-[#fff5f8] px-6 py-4 border-b border-pink-100">
              <h2 className="text-lg font-bold text-[#4b343b]">
                {isEditing ? 'Edit Shop Area' : 'Add New Shop Area'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#92737c] hover:text-[#4b343b]"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

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
                  className="w-full rounded-lg border border-pink-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">
                  Exact Location (Address) *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main Street, Building A, Ground Floor, City, Country, ZIP Code"
                  rows={3}
                  className="w-full rounded-lg border border-pink-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d] resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="e.g., +63 (123) 456-7890"
                  className="w-full rounded-lg border border-pink-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#4b343b] block mb-2">
                  Operating Hours
                </label>
                <input
                  type="text"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon-Fri 9AM-6PM, Sat 10AM-4PM"
                  className="w-full rounded-lg border border-pink-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c18c2d]"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 font-semibold text-[#4b343b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-[#c18c2d] hover:bg-[#b07720] px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update Area' : 'Create Area'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="rounded-3xl bg-white max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#4b343b]">
                    {confirmAction.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#80656d]">
                    {confirmAction.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-pink-100 bg-white p-6">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border-2 border-[#e9b5c3] bg-white hover:bg-[#fff5f8] px-4 py-3 font-semibold text-[#4b343b] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction.action}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-3 font-semibold text-white transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminShopareas;
