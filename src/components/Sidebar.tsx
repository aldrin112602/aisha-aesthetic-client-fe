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
  X,
} from 'lucide-react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  clearCurrentUser,
  getCurrentUser,
} from '../utils/auth';

import Swal from 'sweetalert2';

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
      name: 'Manage Accounts',
      path: '/account-management',
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

function Sidebar({
  isMobileOpen = false,
  onMobileClose,
}: {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // GET CURRENT USER
  // =========================================================
  const currentUser = getCurrentUser();

  const role = currentUser?.role || 'customer';

  const navigation =
    navigationByRole[role] ||
    navigationByRole.customer;

  // =========================================================
  // LOGOUT
  // =========================================================
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        clearCurrentUser();

        navigate('/signin');

        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // =========================================================
  // NAVIGATION
  // =========================================================
  const renderNavigation = (
    onItemClick?: () => void
  ) => (
    <nav className="flex flex-col gap-1.5">
      {navigation.map((item) => {
        const Icon = item.icon;

        const isActive =
          location.pathname === item.path;

        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onItemClick}
            className={`
              flex
              w-full
              min-w-0
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              transition
              duration-200

              ${
                isActive
                  ? 'bg-gradient-to-r from-[#f9dce3] to-[#fff1f4] text-[#c26c84]'
                  : 'text-[#80636d] hover:bg-[#fff5f7]'
              }
            `}
          >
            <Icon
              size={19}
              className="shrink-0"
            />

            <span className="min-w-0 truncate whitespace-nowrap">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}

      <aside
        className="
          sticky
          top-[72px]

          hidden
          h-[calc(100vh-72px)]

          w-[260px]
          min-w-[260px]
          max-w-[260px]

          shrink-0

          flex-col

          overflow-hidden

          border-r
          border-pink-100

          bg-white

          px-4
          py-6

          md:flex
        "
      >
        {/* ===================================================
            DESKTOP SIDEBAR CONTENT
            =================================================== */}

        <div className="flex h-full min-h-0 flex-col">

          {/* =================================================
              BRAND / ROLE
              ================================================= */}

          <div className="mb-8 flex shrink-0 items-center gap-3 px-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#fff0d8]
                text-[#b88a2c]
              "
            >
              <Sparkles size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-bold text-[#49343a]">
                Aisha
              </h2>

              <p className="truncate text-xs capitalize text-[#b88a2c]">
                {role} Access
              </p>
            </div>
          </div>

          {/* =================================================
              NAVIGATION

              flex-1 allows navigation to use remaining
              sidebar height without breaking width.
              ================================================= */}

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-color:#e2a0b1_#fff4f6] [scrollbar-width:thin]">
            {renderNavigation()}
          </div>

          {/* =================================================
              LOGOUT
              ================================================= */}

          <div className="mt-4 shrink-0 border-t border-pink-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                font-medium
                text-[#c66b83]
                transition
                hover:bg-pink-50
              "
            >
              <LogOut
                size={19}
                className="shrink-0"
              />

              <span className="whitespace-nowrap">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE SIDEBAR
          ===================================================== */}

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">

          {/* =================================================
              BACKDROP
              ================================================= */}

          <button
            type="button"
            className="
              absolute
              inset-0
              bg-black/35
            "
            aria-label="Close navigation menu"
            onClick={onMobileClose}
          />

          {/* =================================================
              MOBILE SIDEBAR
              ================================================= */}

          <aside
            className="
              relative

              flex
              h-full

              w-[min(82vw,320px)]

              flex-col

              overflow-hidden

              border-r
              border-pink-100

              bg-white

              px-4
              py-5

              shadow-2xl
            "
          >
            <div className="flex h-full min-h-0 flex-col">

              {/* =============================================
                  MOBILE BRAND
                  ============================================= */}

              <div className="mb-6 flex shrink-0 items-center justify-between gap-3 px-2">

                <div className="flex min-w-0 items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#fff0d8]
                      text-[#b88a2c]
                    "
                  >
                    <Sparkles size={21} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-[#49343a]">
                      Aisha
                    </h2>

                    <p className="truncate text-xs capitalize text-[#b88a2c]">
                      {role} Access
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={onMobileClose}
                  className="
                    shrink-0
                    rounded-xl
                    p-2
                    text-[#70535d]
                    hover:bg-pink-50
                  "
                  aria-label="Close navigation menu"
                >
                  <X size={21} />
                </button>

              </div>

              {/* =============================================
                  MOBILE NAVIGATION
                  ============================================= */}

              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-color:#e2a0b1_#fff4f6] [scrollbar-width:thin]">
                {renderNavigation(onMobileClose)}
              </div>

              {/* =============================================
                  MOBILE LOGOUT
                  ============================================= */}

              <div className="mt-4 shrink-0 border-t border-pink-100 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-[#c66b83]
                    transition
                    hover:bg-pink-50
                  "
                >
                  <LogOut
                    size={19}
                    className="shrink-0"
                  />

                  <span className="whitespace-nowrap">
                    Logout
                  </span>
                </button>
              </div>

            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;