import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  shopArea: string;
  status: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  shopArea: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  password: '',
  role: 'Employee',
  shopArea: 'Main Branch - Area A',
};

function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/users?role=Employee`);
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialFormData);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleEditEmployee = async (employee: Employee) => {
    setIsEditing(true);
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: '',
      role: employee.role,
      shopArea: employee.shopArea,
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.role || !formData.shopArea) {
      setError('Please fill all required fields');
      return;
    }

    if (!isEditing && !formData.password) {
      setError('Password is required for new employees');
      return;
    }

    try {
      let response;
      let payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        shopArea: formData.shopArea,
      };

      if (isEditing && editingId) {
        if (formData.password) {
          payload.password = formData.password;
        }
        response = await fetch(`${apiBaseUrl}/api/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        payload.password = formData.password;
        response = await fetch(`${apiBaseUrl}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save employee');
      }

      setSuccess(isEditing ? 'Employee updated successfully!' : 'Employee added successfully!');
      setFormData(initialFormData);
      
      setTimeout(() => {
        setShowModal(false);
        fetchEmployees();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteEmployee = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete employee');
      }

      setSuccess('Employee deleted successfully!');
      setTimeout(() => {
        fetchEmployees();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-[#edf9f1] text-[#2f7d59]';
      case 'on leave':
        return 'bg-[#fff5df] text-[#b88a2c]';
      case 'inactive':
        return 'bg-[#fee5e5] text-[#c1433f]';
      default:
        return 'bg-[#edf9f1] text-[#2f7d59]';
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">Manage employee accounts, roles, and assigned shop areas.</p>
        </div>

        <button
          onClick={handleOpenModal}
          className="primary-btn"
        >
          Add Employee
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-sm text-[#7c5b63]">
          Loading employees...
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-6 text-center text-sm text-[#7c5b63]">
          No employees found. Click "Add Employee" to get started.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#fff4f6] text-[#5b3e45]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
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
                    <td className="px-4 py-3 text-[#666]">{employee.email}</td>
                    <td className="px-4 py-3">{employee.role}</td>
                    <td className="px-4 py-3">{employee.shopArea}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="secondary-btn px-3 py-2 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                          className="flex items-center gap-1 rounded-lg bg-[#fee5e5] px-3 py-2 text-xs font-semibold text-[#c1433f] hover:bg-[#fdd5d5]"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#4b343b]">
                {isEditing ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-[#999] hover:text-[#666]"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-[#fee5e5] p-3 text-sm text-[#c1433f]">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-[#edf9f1] p-3 text-sm text-[#2f7d59]">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#4b343b]">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Employee name"
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4b343b]">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="employee@aisha.com"
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4b343b]">
                  {isEditing ? 'Password (leave blank to keep current)' : 'Password'} *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4b343b]">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required
                >
                  <option value="Employee">Employee</option>
                  <option value="Customer">Customer</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4b343b]">Shop / Area *</label>
                <select
                  name="shopArea"
                  value={formData.shopArea}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required
                >
                  <option value="Main Branch - Area A">Main Branch - Area A</option>
                  <option value="Main Branch - Area B">Main Branch - Area B</option>
                  <option value="VIP Treatment Room">VIP Treatment Room</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="secondary-btn flex-1 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn flex-1 py-2"
                >
                  {isEditing ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;
