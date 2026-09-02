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
import AdminServices from './pages/AdminServices';
import WalkinManagement from './pages/WalkinManagement';
import FollowupReminders from './pages/FollowupReminders';


/* =========================================================
   ROLE ROUTE MAP
========================================================= */

const roleRouteMap: Record<string, string> = {
  admin: '/admin',
  employee: '/employee',
  customer: '/customer',
};


/* =========================================================
   GET CURRENT USER
========================================================= */

function getCurrentUser() {
  const savedUser = localStorage.getItem('aisha_user');

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('aisha_user');
    return null;
  }
}


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const location = useLocation();
  const currentUser = getCurrentUser();


  /* -----------------------------------------
     USER IS NOT LOGGED IN
  ----------------------------------------- */

  if (!currentUser) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  /* -----------------------------------------
     USER HAS WRONG ROLE
  ----------------------------------------- */

  if (!allowedRoles.includes(currentUser.role)) {
    const fallback =
      roleRouteMap[currentUser.role] || '/signin';

    return (
      <Navigate
        to={fallback}
        replace
      />
    );
  }


  /* -----------------------------------------
     USER IS AUTHORIZED
  ----------------------------------------- */

  return <>{children}</>;
}


/* =========================================================
   APP
========================================================= */

function App() {
  const location = useLocation();
  const currentUser = getCurrentUser();


  /* =======================================================
     PROTECTED LAYOUT
  ======================================================= */

  const renderProtectedLayout = (
    children: React.ReactNode
  ) => {
    return (
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
  };


  /* =======================================================
     ROOT ROUTE
     
     NOT LOGGED IN:
       / → /signin
     
     LOGGED IN:
       admin    → /admin
       employee → /employee
       customer → /customer
  ======================================================= */

  if (location.pathname === '/') {

    if (!currentUser) {
      return (
        <Navigate
          to="/signin"
          replace
        />
      );
    }

    const destination =
      roleRouteMap[currentUser.role] || '/signin';

    return (
      <Navigate
        to={destination}
        replace
      />
    );
  }


  /* =======================================================
     ROUTES
  ======================================================= */

  return (
    <Routes>

      {/* =================================================
          SIGN IN
          
          http://localhost:5173/signin
          
          IMPORTANT:
          This is now directly accessible.
      ================================================= */}

      <Route
        path="/signin"
        element={<Signin />}
      />


      {/* =================================================
          SIGN UP
          
          http://localhost:5173/signup
      ================================================= */}

      <Route
        path="/signup"
        element={<Signup />}
      />


      {/* =================================================
          ADMIN DASHBOARD
      ================================================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={['admin']}
          >
            {renderProtectedLayout(
              <AdminDashboard />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          EMPLOYEE DASHBOARD
      ================================================= */}

      <Route
        path="/employee"
        element={
          <ProtectedRoute
            allowedRoles={['employee']}
          >
            {renderProtectedLayout(
              <EmployeeDashboard />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          CUSTOMER DASHBOARD
      ================================================= */}

      <Route
        path="/customer"
        element={
          <ProtectedRoute
            allowedRoles={['customer']}
          >
            {renderProtectedLayout(
              <CustomerDashboard />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          ADMIN DASHBOARD / LEGACY
      ================================================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={['admin']}
          >
            {renderProtectedLayout(
              <Dashboard />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          ADMIN APPOINTMENTS
      ================================================= */}

      <Route
        path="/admin-appointments"
        element={
          <ProtectedRoute
            allowedRoles={['admin']}
          >
            {renderProtectedLayout(
              <AdminAppointments />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          EMPLOYEE MANAGEMENT
      ================================================= */}

      <Route
        path="/employee-management"
        element={
          <ProtectedRoute
            allowedRoles={['admin']}
          >
            {renderProtectedLayout(
              <EmployeeManagement />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          SHOP AREAS
      ================================================= */}

      <Route
        path="/shop-areas"
        element={
          <ProtectedRoute
            allowedRoles={['admin']}
          >
            {renderProtectedLayout(
              <AdminShopareas />
            )}
          </ProtectedRoute>
        }
      />

        <Route
                path="/services"
                element={
                  <ProtectedRoute
                    allowedRoles={['admin']}
                  >
                    {renderProtectedLayout(
                      <AdminServices />
                    )}
                  </ProtectedRoute>
                }
      />



      {/* =================================================
          WALK-IN MANAGEMENT
      ================================================= */}

      <Route
        path="/walkins"
        element={
          <ProtectedRoute
            allowedRoles={['employee', 'admin']}
          >
            {renderProtectedLayout(
              <WalkinManagement />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <Route
        path="/notifications"
        element={
          <ProtectedRoute
            allowedRoles={[
              'admin',
              'employee',
              'customer',
            ]}
          >
            {renderProtectedLayout(
              <FollowupReminders />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          CUSTOMER BOOKING
      ================================================= */}

      <Route
        path="/booking"
        element={
          <ProtectedRoute
            allowedRoles={['customer']}
          >
            {renderProtectedLayout(
              <Booking />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          APPOINTMENTS
      ================================================= */}

      <Route
        path="/appointments"
        element={
          <ProtectedRoute
            allowedRoles={[
              'admin',
              'employee',
              'customer',
            ]}
          >
            {renderProtectedLayout(
              <Appointments />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          CUSTOMER HISTORY
      ================================================= */}

      <Route
        path="/history"
        element={
          <ProtectedRoute
            allowedRoles={['customer']}
          >
            {renderProtectedLayout(
              <History />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          PROFILE
      ================================================= */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute
            allowedRoles={[
              'admin',
              'employee',
              'customer',
            ]}
          >
            {renderProtectedLayout(
              <Profile />
            )}
          </ProtectedRoute>
        }
      />


      {/* =================================================
          UNKNOWN ROUTE
          
          Example:
          /something-that-does-not-exist
      ================================================= */}

      <Route
        path="*"
        element={
          currentUser ? (
            <Navigate
              to={
                roleRouteMap[currentUser.role] ||
                '/signin'
              }
              replace
            />
          ) : (
            <Navigate
              to="/signin"
              replace
            />
          )
        }
      />

    </Routes>
  );
}

export default App;