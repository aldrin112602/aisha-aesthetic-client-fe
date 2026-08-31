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
import Notification from './pages/Notification';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Profile from './pages/profile';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  const location = useLocation();
  const savedUser = localStorage.getItem('aisha_user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  const authPages = ['/signin', '/signup'];
  const isAuthPage = authPages.includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  const roleRouteMap: Record<string, string> = {
    admin: '/admin',
    employee: '/employee',
    customer: '/customer',
  };

  const expectedRoute = roleRouteMap[currentUser.role] || '/customer';

  if (location.pathname === '/') {
    return <Navigate to={expectedRoute} replace />;
  }

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
      <Route
        path="/admin"
        element={renderProtectedLayout(<AdminDashboard />)}
      />
      <Route
        path="/employee"
        element={renderProtectedLayout(<EmployeeDashboard />)}
      />
      <Route
        path="/customer"
        element={renderProtectedLayout(<CustomerDashboard />)}
      />

      <Route path="/dashboard" element={renderProtectedLayout(<Dashboard />)} />
      <Route path="/booking" element={renderProtectedLayout(<Booking />)} />
      <Route path="/appointments" element={renderProtectedLayout(<Appointments />)} />
      <Route path="/history" element={renderProtectedLayout(<History />)} />
      <Route path="/notifications" element={renderProtectedLayout(<Notification />)} />
      <Route path="/profile" element={renderProtectedLayout(<Profile />)} />
      <Route path="*" element={<Navigate to={expectedRoute} replace />} />
    </Routes>
  );
}

export default App;