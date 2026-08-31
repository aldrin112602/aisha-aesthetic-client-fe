import { useEffect, useState } from 'react';
import { AlertCircle, Bell, Calendar, CheckCircle2, Mail } from 'lucide-react';

interface Followup {
  id: number;
  customerId: number;
  serviceId: number | null;
  date: string;
  notes: string | null;
  status: string;
}

function FollowupReminders() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    notes: '',
  });

  const savedUser = localStorage.getItem('aisha_user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const isCustomer = currentUser?.role === 'customer';

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    const url = isCustomer
      ? `${apiBaseUrl}/api/followups?customerId=${currentUser?.id}`
      : `${apiBaseUrl}/api/followups`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => setFollowups(Array.isArray(data) ? data : []))
      .catch(() => setFollowups([]))
      .finally(() => setLoading(false));
  }, [isCustomer, currentUser?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleFollowup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.date) {
      alert('Please select a follow-up date.');
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/followups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser?.id,
          date: formData.date,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to schedule follow-up.');
      }

      setFollowups((prev) => [data, ...prev]);
      setFormData({ date: '', notes: '' });
      setShowForm(false);
      alert('Follow-up scheduled successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      alert(`Failed to schedule follow-up: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (followupId: number, newStatus: string) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${apiBaseUrl}/api/followups/${followupId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Unable to update follow-up status.');
      }

      setFollowups((prev) =>
        prev.map((item) =>
          item.id === followupId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      alert(`Failed to update follow-up: ${message}`);
    }
  };

  const upcoming = followups.filter((f) => f.status === 'scheduled').length;
  const completed = followups.filter((f) => f.status === 'completed').length;

  return (
    <div className="page-container">
      {/* Email Notification Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <Mail size={18} className="text-green-600" />
        <p className="text-sm font-semibold text-green-800">
          📧 Email notifications enabled. All reminders will be sent to your registered email.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Reminders & Follow-ups</h1>
          <p className="page-subtitle">Manage appointment reminders and service follow-ups.</p>
        </div>

        {isCustomer && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="primary-btn hidden md:block"
          >
            {showForm ? 'Cancel' : 'Schedule Follow-up'}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          ['Upcoming', String(upcoming), '#d77992'],
          ['Completed', String(completed), '#2f7d59'],
          ['Total', String(followups.length), '#b88a2c'],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-[#92737c]">{label}</p>
            <p className="mt-2 text-2xl font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Schedule Form */}
      {isCustomer && showForm && (
        <div className="mb-6 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-[#4b343b]">Schedule a Follow-up</h2>

          <form onSubmit={handleScheduleFollowup} className="space-y-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5d444c]">
                <Calendar size={16} className="text-[#c18c2d]" />
                Follow-up Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="mb-2 text-sm font-semibold text-[#5d444c]">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="input-field w-full resize-none"
                rows={3}
                placeholder="E.g., Retouch, consultation, etc."
              />
            </div>

            <button type="submit" disabled={loading} className="primary-btn mt-4 disabled:opacity-70">
              {loading ? 'Scheduling...' : 'Schedule Follow-up'}
            </button>
          </form>
        </div>
      )}

      {/* Mobile Schedule Button */}
      {isCustomer && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="primary-btn mb-6 w-full md:hidden"
        >
          Schedule Follow-up
        </button>
      )}

      {/* Follow-ups List */}
      <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-[#4b343b]">Follow-up Reminders</h2>

        {loading ? (
          <div className="rounded-xl border border-pink-100 bg-[#fffafb] p-6 text-sm text-[#7c5b63]">
            Loading reminders...
          </div>
        ) : followups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-pink-200 bg-[#fffafb] p-6 text-sm text-[#7c5b63]">
            <Bell size={24} className="mb-2 text-[#d77992]" />
            No follow-ups scheduled yet.
          </div>
        ) : (
          <div className="space-y-3">
            {followups.map((followup) => {
              const isUpcoming = followup.status === 'scheduled';
              const isOverdue = new Date(followup.date) < new Date() && isUpcoming;

              return (
                <div
                  key={followup.id}
                  className={`rounded-xl border p-4 ${
                    isUpcoming
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-pink-100 bg-[#fffafb]'
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {isUpcoming ? (
                          <AlertCircle size={20} className="text-yellow-600" />
                        ) : (
                          <CheckCircle2 size={20} className="text-green-600" />
                        )}

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                            isUpcoming
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {followup.status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-[#c18c2d]" />
                          <span className="font-semibold text-[#4b343b]">{followup.date}</span>
                          {isOverdue && (
                            <span className="ml-2 text-xs font-bold text-red-600">OVERDUE</span>
                          )}
                        </div>

                        {followup.notes && (
                          <p className="text-sm text-[#745d65]">
                            <span className="font-semibold">Note:</span> {followup.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {isUpcoming && (
                      <button
                        type="button"
                        onClick={() => updateStatus(followup.id, 'completed')}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FollowupReminders;
