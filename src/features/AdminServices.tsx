import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Heart,
  Flower2,
  Scissors,
  Package,
  Clock3,
} from 'lucide-react';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Swal from 'sweetalert2';

type ServiceItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string | null;
  type?: 'Service' | 'Product';
  status: 'active' | 'inactive';
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AdminService() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const emptyForm = {
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    type: 'Service' as 'Service' | 'Product',
    status: 'active' as 'active' | 'inactive',
  };

  const [form, setForm] = useState(emptyForm);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load services';
      Swal.fire('Error', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    ...Array.from(new Set(services.map((service) => service.category))),
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        service.name.toLowerCase().includes(searchText) ||
        service.category.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText);

      const matchesCategory =
        category === 'All' || service.category === category;

      const matchesType =
        type === 'All' || (service.type || 'Service') === type;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [services, search, category, type]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
      price: String(service.price),
      duration: service.duration || '',
      type: service.type || 'Service',
      status: service.status as 'active' | 'inactive',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleFormChange = (
    field: keyof typeof emptyForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]:
        field === 'type'
          ? (value as 'Service' | 'Product')
          : field === 'status'
            ? (value as 'active' | 'inactive')
            : value,
    }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const categoryValue = form.category.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name || !categoryValue || !form.price || Number.isNaN(price) || price < 0) {
      Swal.fire('Validation Error', 'Please complete the required fields and enter a valid price.', 'warning');
      return;
    }

    if (form.type === 'Service' && !form.duration.trim()) {
      Swal.fire('Validation Error', 'Please enter the service duration.', 'warning');
      return;
    }

    try {
      setIsSaving(true);
      const method = editingId === null ? 'POST' : 'PUT';
      const endpoint = editingId === null
        ? `${API_URL}/api/services`
        : `${API_URL}/api/services/${editingId}`;

      const payload = {
        name,
        category: categoryValue,
        description,
        price,
        duration: form.type === 'Service' ? form.duration.trim() : null,
        shopArea: '',
        status: form.status,
        type: form.type,
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save service');
      }

      await fetchServices();
      closeModal();

      Swal.fire(
        'Success',
        `Service ${editingId === null ? 'created' : 'updated'} successfully!`,
        'success'
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save service';
      Swal.fire('Error', message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    const service = services.find((item) => item.id === id);
    if (!service) return;

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${service.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const response = await fetch(`${API_URL}/api/services/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete service');
        }

        await fetchServices();

        Swal.fire({
          title: 'Deleted!',
          text: `"${service.name}" has been deleted.`,
          icon: 'success',
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete service';
        Swal.fire('Error', message, 'error');
      }
    });
  };

  const toggleStatus = async (id: number) => {
    const service = services.find((item) => item.id === id);
    if (!service) return;

    const newStatus = service.status === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: service.name,
          category: service.category,
          description: service.description,
          price: service.price,
          duration: service.duration,
          status: newStatus,
          type: service.type || 'Service',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchServices();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      Swal.fire('Error', message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500"></div>
            <p className="mt-3 text-sm text-[#92737c]">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="page-title">Services & Products</h1>
          <p className="mt-1 text-sm text-[#92737c]">
            Manage AishaEsthetics services, treatments, and beauty products.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="primary-btn flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="pink-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2df] text-[#c18c2d]">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs text-[#92737c]">Total Services</p>
              <p className="text-2xl font-bold text-[#4b343b]">
                {services.filter((item) => !item.type || item.type === 'Service').length}
              </p>
            </div>
          </div>
        </div>

        <div className="pink-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2f4] text-[#d77992]">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs text-[#92737c]">Products</p>
              <p className="text-2xl font-bold text-[#4b343b]">
                {services.filter((item) => item.type === 'Product').length}
              </p>
            </div>
          </div>
        </div>

        <div className="pink-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3ecff] text-[#8666a8]">
              <Flower2 size={20} />
            </div>
            <div>
              <p className="text-xs text-[#92737c]">Categories</p>
              <p className="text-2xl font-bold text-[#4b343b]">
                {Math.max(categories.length - 1, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="pink-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8f2] text-[#4d9a72]">
              <Heart size={20} />
            </div>
            <div>
              <p className="text-xs text-[#92737c]">Active</p>
              <p className="text-2xl font-bold text-[#4b343b]">
                {services.filter((item) => item.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b49aa2]"
            />
            <input
              type="text"
              placeholder="Search services or products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="input-field w-full"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="input-field w-full"
          >
            <option value="All">All Types</option>
            <option value="Service">Services</option>
            <option value="Product">Products</option>
          </select>
        </div>
      </div>

      {/* SERVICE LIST */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="border-b border-pink-100 bg-[#fff8fa]">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Service / Product
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Category
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Type
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Price
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Duration
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Status
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredServices.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-pink-50 last:border-0 hover:bg-[#fffafa]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2f4] text-[#d77992]">
                        {(service.type || 'Service') === 'Product' ? (
                          <Package size={18} />
                        ) : (
                          <Sparkles size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#4b343b]">
                          {service.name}
                        </p>
                        <p className="mt-1 max-w-xs text-xs text-[#92737c]">
                          {service.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-[#6d4a54]">
                    {service.category}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        (service.type || 'Service') === 'Service'
                          ? 'bg-[#fff2f4] text-[#d77992]'
                          : 'bg-[#fff2df] text-[#b88a2c]'
                      }`}
                    >
                      {service.type || 'Service'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[#c18c2d]">
                    ₱{service.price.toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#6d4a54]">
                      {service.duration && <Clock3 size={15} />}
                      {service.duration || '-'}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => toggleStatus(service.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.status === 'active'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      title="Click to change status"
                    >
                      {service.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(service)}
                        className="rounded-lg bg-[#fff5f8] p-2 text-[#d77992] transition hover:bg-[#ffdce6]"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(service.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="space-y-3 p-4 md:hidden">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-pink-100 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2f4] text-[#d77992]">
                    {(service.type || 'Service') === 'Product' ? (
                      <Package size={18} />
                    ) : (
                      <Sparkles size={18} />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-[#4b343b]">
                      {service.name}
                    </p>
                    <p className="text-xs text-[#92737c]">
                      {service.category}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStatus(service.id)}
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                    service.status === 'active'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {service.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </div>

              <p className="mt-3 text-sm text-[#80656d]">
                {service.description || 'No description'}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[#c18c2d]">
                    ₱{service.price.toLocaleString()}
                  </p>

                  {service.duration && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#92737c]">
                      <Clock3 size={13} />
                      {service.duration}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    className="rounded-lg bg-[#fff5f8] p-2 text-[#d77992]"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className="rounded-lg bg-red-50 p-2 text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="p-10 text-center">
            <Scissors size={36} className="mx-auto text-[#d9b9c2]" />
            <p className="mt-3 font-semibold text-[#4b343b]">
              No services or products found
            </p>
            <p className="mt-1 text-sm text-[#92737c]">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-[#92737c]">
        Showing {filteredServices.length} of {services.length} services and products
      </p>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-pink-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#49343a]">
                  {editingId === null ? 'Add Service / Product' : 'Edit Service / Product'}
                </h2>
                <p className="mt-1 text-xs text-[#92737c]">
                  Enter the details below and save your changes.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-3 py-2 text-xl text-[#92737c] hover:bg-[#fff5f7]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#5d424a]">
                    Service / Product *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => handleFormChange('name', event.target.value)}
                    className="input-field w-full"
                    placeholder="e.g. Lash Lift"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#5d424a]">
                    Category *
                  </label>
                  <input
                    required
                    value={form.category}
                    onChange={(event) => handleFormChange('category', event.target.value)}
                    className="input-field w-full"
                    placeholder="e.g. Lash Care"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#5d424a]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) => handleFormChange('description', event.target.value)}
                  className="input-field w-full resize-none"
                  placeholder="Describe the service or product..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#5d424a]">
                    Type *
                  </label>
                  <select
                    required
                    value={form.type}
                    onChange={(event) => handleFormChange('type', event.target.value)}
                    className="input-field w-full"
                  >
                    <option value="Service">Service</option>
                    <option value="Product">Product</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#5d424a]">
                    Price *
                  </label>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.price}
                    onChange={(event) => handleFormChange('price', event.target.value)}
                    className="input-field w-full"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#5d424a]">
                    Duration {form.type === 'Service' ? '*' : ''}
                  </label>
                  <input
                    required={form.type === 'Service'}
                    disabled={form.type === 'Product'}
                    value={form.duration}
                    onChange={(event) => handleFormChange('duration', event.target.value)}
                    className="input-field w-full disabled:bg-gray-100 disabled:text-gray-400"
                    placeholder={form.type === 'Product' ? 'Not applicable' : 'e.g. 1 hr 30 min'}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#5d424a]">
                    Status *
                  </label>
                  <select
                    required
                    value={form.status}
                    onChange={(event) => handleFormChange('status', event.target.value)}
                    className="input-field w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-pink-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-pink-100 px-5 py-2.5 text-sm font-semibold text-[#80636d] hover:bg-[#fff5f7]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="primary-btn flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus size={17} />
                  {isSaving ? 'Saving...' : (editingId === null ? 'Save Service' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminService;
