import { useCallback, useEffect, useState } from 'react';
import { Clock, MapPin, Phone, Smartphone, User } from 'lucide-react';

import { getServices } from '../../api/services.api';
import { getShopAreas } from '../../api/shopAreas.api';
import { createWalkin, getWalkins } from '../../api/walkins.api';
import type { Service, ShopArea, WalkinRecord } from '../../types';
import { getCurrentUser } from '../../utils/auth';

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
  const [servicesLoading, setServicesLoading] = useState(true);
  const [shopAreasLoading, setShopAreasLoading] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);

  const fetchServices = useCallback(async () => {
    try {
      setServicesLoading(true);
      const data = await getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  }, []);

  const fetchWalkins = useCallback(async () => {
    try {
      const data = await getWalkins();
      setWalkins(Array.isArray(data) ? data : []);
    } catch {
      setWalkins([]);
    }
  }, []);

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
    } catch {
      setShopAreas([]);
    } finally {
      setShopAreasLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchServices();
      void fetchWalkins();
      void fetchShopAreas();
    });
  }, [fetchServices, fetchWalkins, fetchShopAreas]);

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

  const handleServiceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedServiceId = event.target.value;

    if (!selectedServiceId) {
      setFormData(defaultFormData);
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

  const handleRecordWalkin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.serviceName ||
      !formData.area ||
      !formData.price
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const currentUser = getCurrentUser();

      const data = await createWalkin({
        name: formData.name,
        phoneNumber: formData.phoneNumber || null,
        serviceName: formData.serviceName,
        category: formData.category,
        area: formData.area,
        price: formData.price,
        notes: formData.notes,
        employeeId: currentUser?.id || null,
      });

      setWalkins((current) => [data, ...current]);
      setFormData({
        ...defaultFormData,
        area: shopAreas[0]?.name || '',
      });
      alert('Walk-in recorded successfully!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      alert(`Failed to record walk-in: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">Walk-in Management</h1>
        <p className="page-subtitle">
          Record walk-in customers and complete services on the spot.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-[#4b343b]">
          Record New Walk-in
        </h2>

        <form onSubmit={handleRecordWalkin} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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
                      {service.name} (₱{service.price})
                    </option>
                  ))}
                </select>
              )}
            </div>

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

            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">
                Shop Area *
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="input-field w-full"
                disabled={shopAreasLoading || shopAreas.length === 0}
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

          <button
            type="submit"
            disabled={loading}
            className="primary-btn mt-6 disabled:opacity-70"
          >
            {loading ? 'Recording...' : 'Record Walk-in'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-[#4b343b]">
          Recent Walk-ins
        </h2>

        {walkins.length === 0 ? (
          <div className="rounded-xl border border-dashed border-pink-200 bg-[#fffafb] p-6 text-sm text-[#7c5b63]">
            No walk-in records yet.
          </div>
        ) : (
          <div className="space-y-3">
            {walkins.map((walkin) => (
              <div
                key={walkin.id}
                className="rounded-xl border border-pink-100 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-[#4b343b]">
                        {walkin.name}
                      </p>
                      <span className="rounded-full bg-[#edf9f1] px-2.5 py-1 text-xs font-semibold text-[#2f7d59]">
                        {walkin.status}
                      </span>
                    </div>

                    <div className="mt-2 grid gap-2 text-sm text-[#745d65] sm:grid-cols-2">
                      <p>
                        <span className="font-semibold">
                          {walkin.serviceName}
                        </span>{' '}
                        ({walkin.category})
                      </p>
                      {walkin.phoneNumber && (
                        <p className="flex items-center gap-1">
                          <Smartphone size={14} /> {walkin.phoneNumber}
                        </p>
                      )}
                      <p className="flex items-center gap-1">
                        <MapPin size={14} /> {walkin.area}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock size={14} />{' '}
                        {new Date(walkin.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#c18c2d]">
                      ₱{walkin.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WalkinManagement;
