const employees = [
  { id: 1, name: 'Ana Employee', role: 'Employee', shopArea: 'Main Branch - Area A', status: 'Active' },
  { id: 2, name: 'Liza Ramos', role: 'Employee', shopArea: 'Main Branch - Area B', status: 'Active' },
  { id: 3, name: 'Mia Santos', role: 'Supervisor', shopArea: 'VIP Treatment Room', status: 'On Leave' },
];

function EmployeeManagement() {
  return (
    <div className="page-container">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">Manage employee accounts, roles, and assigned shop areas.</p>
        </div>

        <button className="primary-btn">Add Employee</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#fff4f6] text-[#5b3e45]">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Shop / Area</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t border-pink-100">
                  <td className="px-4 py-3 font-medium text-[#4b343b]">{employee.name}</td>
                  <td className="px-4 py-3">{employee.role}</td>
                  <td className="px-4 py-3">{employee.shopArea}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#edf9f1] px-2.5 py-1 text-xs font-semibold text-[#2f7d59] uppercase">
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="secondary-btn px-3 py-2 text-xs">Edit</button>
                      <button className="secondary-btn px-3 py-2 text-xs">Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeManagement;
