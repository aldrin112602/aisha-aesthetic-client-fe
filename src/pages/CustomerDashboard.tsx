function CustomerDashboard() {
  return (
    <div className="page-container">
      <h1 className="page-title">Customer Dashboard</h1>
      <p className="page-subtitle">Track your appointments, service history, and reminders.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Upcoming Appointment', '1'],
          ['Appointment Status', 'Confirmed'],
          ['Service History', '5'],
          ['Follow-ups', '2'],
        ].map(([label, value]) => (
          <div key={label} className="pink-card">
            <p className="text-sm text-[#92737c]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[#4b343b]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">My Appointments</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>Classic Facial — Aug 30, 2026</li>
            <li>Eyelash Retouch — Sep 10, 2026</li>
            <li>Next reminder: 2 days before appointment</li>
          </ul>
        </div>

        <div className="pink-card">
          <h2 className="text-lg font-bold text-[#4b343b]">Notifications</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6d4a54]">
            <li>Booking confirmation received</li>
            <li>Appointment reminder tomorrow</li>
            <li>Retouch due soon</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
