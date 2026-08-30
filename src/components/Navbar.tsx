import {
  Bell,
  Menu,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/booking") {
      return "Book Appointment";
    }

    if (location.pathname === "/appointments") {
      return "My Appointments";
    }

    if (location.pathname === "/history") {
      return "Appointment History";
    }

    if (location.pathname === "/notifications") {
      return "Notifications";
    }

    if (location.pathname === "/profile") {
      return "Profile";
    }

    return "Welcome Back";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur-md">

      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">

        {/* =====================================================
            LEFT
        ===================================================== */}

        <div className="flex items-center gap-3">

          <button
            type="button"
            className="rounded-xl p-2 text-[#70535d] hover:bg-pink-50 md:hidden"
          >
            <Menu size={22} />
          </button>


          <div>

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b88a2c]">
              Aisha Aesthetics
            </p>

            <h1 className="text-base font-bold text-[#4b343b] sm:text-lg">
              {getPageTitle()}
            </h1>

          </div>

        </div>


        {/* =====================================================
            RIGHT
        ===================================================== */}

        <div className="flex items-center gap-3">

          {/* Notifications */}

          <Link
            to="/notifications"
            className="relative rounded-xl p-2.5 text-[#76545f] transition hover:bg-pink-50"
            aria-label="Notifications"
          >

            <Bell size={21} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#df7f98]" />

          </Link>


          {/* =================================================
              CLIENT ACCOUNT
          ================================================= */}

          <Link
            to="/profile"
            className="group hidden items-center gap-2 rounded-xl border border-pink-100 bg-[#fffafb] px-3 py-2 transition duration-200 hover:border-[#e8c6cf] hover:bg-[#fff5f7] sm:flex"
          >

            {/* Avatar */}

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9d7df] text-[#bd6c83] transition duration-200 group-hover:scale-105">

              <Sparkles size={15} />

            </div>


            {/* Account */}

            <div>

              <p className="text-xs font-semibold text-[#4b343b]">
                Beautiful!
              </p>

              <p className="text-[10px] text-[#a2878f]">
                Client Account
              </p>

            </div>

          </Link>

        </div>

      </div>

    </header>
  );
}

export default Navbar;