import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Dashboard from './features/Dashboard';
import Booking from './features/booking/BookingPage';
import Appointments from './features/appointments/AppointmentsPage';
import History from './features/History';
import Signin from './features/Signin';
import Signup from './features/Signup';
import Profile from './features/profile';
import AdminDashboard from './features/AdminDashboard';
import EmployeeDashboard from './features/EmployeeDashboard';
import CustomerDashboard from './features/CustomerDashboard';
import AdminAppointments from './features/appointments/AdminAppointments';
import EmployeeManagement from './features/employees/EmployeeManagementPage';
import AdminShopareas from './features/shop-areas/AdminShopAreasPage';
import AdminServices from './features/services/AdminServicesPage';
import WalkinManagement from './features/walkins/WalkinManagementPage';
import FollowupReminders from './features/followups/FollowupRemindersPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import ProtectedLayout from './layouts/ProtectedLayout';
import { getCurrentUser, getRoleDestination } from './utils/auth';


function App() {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (location.pathname === '/') {
    return <Navigate to={getRoleDestination(currentUser)} replace />;
  }

  return (
    <Routes>
      {/* AUTH */}
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <Signin />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* ROLE DASHBOARDS */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProtectedLayout>
              <AdminDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <ProtectedLayout>
              <EmployeeDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <ProtectedLayout>
              <CustomerDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* LEGACY ADMIN DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN TOOLS */}
      <Route
        path="/admin-appointments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProtectedLayout>
              <AdminAppointments />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee-management"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProtectedLayout>
              <EmployeeManagement />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop-areas"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProtectedLayout>
              <AdminShopareas />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProtectedLayout>
              <AdminServices />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* SHARED (ADMIN + EMPLOYEE) */}
      <Route
        path="/walkins"
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <ProtectedLayout>
              <WalkinManagement />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* SHARED (ALL ROLES) */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={['admin', 'employee', 'customer']}>
            <ProtectedLayout>
              <FollowupReminders />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={['admin', 'employee', 'customer']}>
            <ProtectedLayout>
              <Appointments />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['admin', 'employee', 'customer']}>
            <ProtectedLayout>
              <Profile />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* CUSTOMER ONLY */}
      <Route
        path="/booking"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <ProtectedLayout>
              <Booking />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <ProtectedLayout>
              <History />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN ROUTE */}
      <Route
        path="*"
        element={<Navigate to={getRoleDestination(currentUser)} replace />}
      />
    </Routes>
  );
}

export default App;
