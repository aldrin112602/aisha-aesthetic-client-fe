import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Appointments from './pages/Appointments';
import History from './pages/History';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Profile from './pages/profile';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminAppointments from './pages/AdminAppointments';
import EmployeeManagement from './pages/EmployeeManagement';
import AdminShopareas from './pages/AdminShopareas';
import WalkinManagement from './pages/WalkinManagement';
import FollowupReminders from './pages/FollowupReminders';

const roleRouteMap: Record<string, string> = {
  admin: '/admin',
  employee: '/employee',
  customer: '/customer',
};

function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const location = useLocation();
  const savedUser = localStorage.getItem('aisha_user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  if (!currentUser) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    const fallback = roleRouteMap[currentUser.role] || '/customer';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}

function App() {
  const location = useLocation();
  const savedUser = localStorage.getItem('aisha_user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  const authPages = ['/signin', '/signup'];
  const isAuthPage = authPages.includes(location.pathname);

  if (currentUser && isAuthPage) {
    return <Navigate to={roleRouteMap[currentUser.role] || '/customer'} replace />;
  }

  if (!currentUser && !isAuthPage) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (location.pathname === '/') {
    if (!currentUser) {
      return <Navigate to="/signin" replace />;
    }
    const expectedRoute = roleRouteMap[currentUser.role] || '/customer';
    return <Navigate to={expectedRoute} replace />;
  }

  const expectedRoute = roleRouteMap[currentUser?.role || 'customer'] || '/customer';

  const renderProtectedLayout = (children: React.ReactNode) => (
    <div className="min-h-screen bg-[#fff8fa]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="min-h-[calc(100vh-73px)] flex-1 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            {renderProtectedLayout(<AdminDashboard />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            {renderProtectedLayout(<EmployeeDashboard />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            {renderProtectedLayout(<CustomerDashboard />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            {renderProtectedLayout(<Dashboard />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-appointments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            {renderProtectedLayout(<AdminAppointments />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee-management"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            {renderProtectedLayout(<EmployeeManagement />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop-areas"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            {renderProtectedLayout(<AdminShopareas />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/walkins"
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            {renderProtectedLayout(<WalkinManagement />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={['admin', 'employee', 'customer']}>
            {renderProtectedLayout(<FollowupReminders />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            {renderProtectedLayout(<Booking />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={['admin', 'employee', 'customer']}>
            {renderProtectedLayout(<Appointments />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            {renderProtectedLayout(<History />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['admin', 'employee', 'customer']}>
            {renderProtectedLayout(<Profile />)}
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={expectedRoute} replace />} />
    </Routes>
  );
}

export default App;