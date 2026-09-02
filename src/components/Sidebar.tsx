import {
  Bell,
  CalendarDays,
  Clock3,
  House,
  LogOut,
  PlusCircle,
  Sparkles,
  UserCog,
  Users,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navigationByRole: Record<
  string,
  Array<{
    name: string;
    path: string;
    icon: typeof House;
  }>
> = {
  // =========================================================
  // ADMIN NAVIGATION
  // =========================================================
  admin: [
    {
      name: 'Home',
      path: '/admin',
      icon: House,
    },
    {
      name: 'Appointments',
      path: '/admin-appointments',
      icon: CalendarDays,
    },
    {
      name: 'Employees',
      path: '/employee-management',
      icon: UserCog,
    },
    {
      name: 'Walk-ins',
      path: '/walkins',
      icon: Users,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
    {
      name: 'Shop areas',
      path: '/shop-areas',
      icon: Users,
    },
    {
      name: 'Services',
      path: '/services',
      icon: Sparkles,
    },
  ],

  // =========================================================
  // EMPLOYEE NAVIGATION
  // =========================================================
  employee: [
    {
      name: 'Home',
      path: '/employee',
      icon: House,
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: CalendarDays,
    },
    {
      name: 'Walk-ins',
      path: '/walkins',
      icon: Users,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
  ],

  // =========================================================
  // CUSTOMER NAVIGATION
  // =========================================================
  customer: [
    {
      name: 'Home',
      path: '/customer',
      icon: House,
    },
    {
      name: 'Book Now',
      path: '/booking',
      icon: PlusCircle,
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: CalendarDays,
    },
    {
      name: 'History',
      path: '/history',
      icon: Clock3,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
  ],
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // GET CURRENT USER
  // =========================================================
  const savedUser = localStorage.getItem('aisha_user');

  let currentUser = null;

  try {
    currentUser = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem('aisha_user');
    currentUser = null;
  }

  const role = currentUser?.role || 'customer';

  const navigation =
    navigationByRole[role] || navigationByRole.customer;

  // =========================================================
  // LOGOUT
  // =========================================================
  const handleLogout = () => {
    localStorage.removeItem('aisha_user');
    navigate('/signin');
  };

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}
      <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[250px] flex-col border-r border-pink-100 bg-white px-4 py-6 md:flex">

        {/* BRAND / ROLE */}
        <div className="mb-8 flex items-center gap-3 px-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0d8] text-[#b88a2c]">
            <Sparkles size={21} />
          </div>

          <div>
            <h2 className="font-bold text-[#49343a]">
              Aisha
            </h2>

            <p className="text-xs text-[#b88a2c] capitalize">
              {role} Access
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-[#f9dce3] to-[#fff1f4] text-[#c26c84]'
                    : 'text-[#80636d] hover:bg-[#fff5f7]'
                }`}
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto border-t border-pink-100 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#c66b83] transition hover:bg-pink-50"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink-100 bg-white px-2 py-2 md:hidden">
        <div className="flex items-center justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] ${
                  isActive
                    ? 'text-[#d77992]'
                    : 'text-[#987b84]'
                }`}
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default Sidebar;