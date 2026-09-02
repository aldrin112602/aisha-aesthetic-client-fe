import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Today's Appointments", '18'],
          ['Upcoming Appointments', '18'],
          ['Pending Approval', '7'],
          ['Confirmed', '31'],
        ].map(([label, value]) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate('/admin-appointments')}
            className="pink-card w-full cursor-pointer text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d77992] active:scale-[0.98]"
          >
            <p className="text-sm text-[#92737c]">{label}</p>
            <p className="mt-3 text-3xl font-bold text-[#4b343b]">{value}</p>
            <p className="mt-2 text-xs font-medium text-[#d77992]">
              View appointments
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">
            Appointment Status
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>Completed Appointments: 56</li>
            <li>Cancelled Appointments: 8</li>
            <li>No Show Appointments: 3</li>
            <li>Walk-in Customers: 14</li>
          </ul>
        </div>

        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">
            Employee Duty Status
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>On Duty: 7</li>
            <li>Available: 4</li>
            <li>On Break: 2</li>
            <li>Unassigned: 1</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
