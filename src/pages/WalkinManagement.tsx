import { useEffect, useState } from 'react';
import { Clock, Phone, User } from 'lucide-react';

interface WalkinRecord {
  id: number;
  name: string;
  phoneNumber: string | null;
  serviceName: string;
  category: string;
  area: string;
  price: number;
  status: string;
  createdAt: string;
}

function WalkinManagement() {
  const [walkins, setWalkins] = useState<WalkinRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    serviceName: '',
    category: '',
    area: 'Main Branch - Area A',
    price: 1500,
    notes: '',
  });

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    fetch(`${apiBaseUrl}/api/walkins`)
      .then((response) => response.json())
      .then((data) => setWalkins(Array.isArray(data) ? data : []))
      .catch(() => setWalkins([]));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseInt(value, 10) : value,
    }));
  };

  const handleRecordWalkin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.serviceName || !formData.area || !formData.price) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const savedUser = localStorage.getItem('aisha_user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/walkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          employeeId: currentUser?.id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to record walk-in.');
      }

      setWalkins((prev) => [data, ...prev]);
      setFormData({
        name: '',
        phoneNumber: '',
        serviceName: '',
        category: '',
        area: 'Main Branch - Area A',
        price: 1500,
        notes: '',
      });

      alert('Walk-in recorded successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      alert(`Failed to record walk-in: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">Walk-in Management</h1>
        <p className="page-subtitle">Record walk-in customers and complete services on the spot.</p>
      </div>

      {/* Walk-in Form */}
      <div className="mb-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-[#4b343b]">Record New Walk-in</h2>

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
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">Service Name *</label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="E.g., Classic Lashes, Facial"
                required
              />
            </div>

            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="E.g., Eyelash Extensions"
              />
            </div>

            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">Shop Area *</label>
              <select name="area" value={formData.area} onChange={handleInputChange} className="input-field w-full">
                <option value="Main Branch - Area A">Main Branch - Area A</option>
                <option value="Main Branch - Area B">Main Branch - Area B</option>
                <option value="VIP Treatment Room">VIP Treatment Room</option>
              </select>
            </div>

            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">Price (₱) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="1500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 text-sm font-semibold text-[#5d444c]">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="input-field w-full resize-none"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          <button type="submit" disabled={loading} className="primary-btn mt-6 disabled:opacity-70">
            {loading ? 'Recording...' : 'Record Walk-in'}
          </button>
        </form>
      </div>

      {/* Walk-ins List */}
      <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-[#4b343b]">Recent Walk-ins</h2>

        {walkins.length === 0 ? (
          <div className="rounded-xl border border-dashed border-pink-200 bg-[#fffafb] p-6 text-sm text-[#7c5b63]">
            No walk-in records yet.
          </div>
        ) : (
          <div className="space-y-3">
            {walkins.map((walkin) => (
              <div key={walkin.id} className="rounded-xl border border-pink-100 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-[#4b343b]">{walkin.name}</p>
                      <span className="rounded-full bg-[#edf9f1] px-2.5 py-1 text-xs font-semibold text-[#2f7d59]">
                        {walkin.status}
                      </span>
                    </div>

                    <div className="mt-2 grid gap-2 text-sm text-[#745d65] sm:grid-cols-2">
                      <p>
                        <span className="font-semibold">{walkin.serviceName}</span> ({walkin.category})
                      </p>
                      {walkin.phoneNumber && <p>📱 {walkin.phoneNumber}</p>}
                      <p>📍 {walkin.area}</p>
                      <p className="flex items-center gap-1">
                        <Clock size={14} /> {new Date(walkin.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#c18c2d]">₱{walkin.price.toLocaleString()}</p>
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
