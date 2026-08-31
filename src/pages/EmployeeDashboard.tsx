function EmployeeDashboard() {
  return (
    <div className="page-container">
      <h1 className="page-title">Employee Dashboard</h1>
      <p className="page-subtitle">Assigned appointments, reminders, and daily service updates.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Today\'s Appointments', '6'],
          ['Upcoming', '12'],
          ['Assigned to Me', '4'],
          ['Follow-ups', '3'],
        ].map(([label, value]) => (
          <div key={label} className="pink-card">
            <p className="text-sm text-[#92737c]">{label}</p>
            <p className="mt-3 text-3xl font-bold text-[#4b343b]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">Appointment Status</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>Pending: 2</li>
            <li>Confirmed: 5</li>
            <li>In Progress: 1</li>
            <li>Completed: 9</li>
          </ul>
        </div>

        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">Notifications</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>Upcoming appointment in 2 days</li>
            <li>Retouch reminder due</li>
            <li>Walk-in customer recorded</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
