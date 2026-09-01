import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import beautyWoman from '../assets/img/beauty.png';

function Signin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);
  const [email, setEmail] = useState('admin@aisha.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in.');
      }

      localStorage.setItem('aisha_user', JSON.stringify(data.user));

      const routeMap: Record<string, string> = {
        admin: '/admin',
        employee: '/employee',
        customer: '/customer',
      };

      navigate(routeMap[data.user.role] || '/customer');
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Login failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8fa] px-4 py-8">

      {/* ==========================================
          MAIN CARD
      ========================================== */}

      <div
        className="
          grid
          w-full
          max-w-5xl
          overflow-hidden
          rounded-3xl
          border
          border-pink-100
          bg-white
          shadow-xl
          shadow-pink-100/40
          md:grid-cols-2
        "
      >

        {/* ==========================================
            LEFT BEAUTY PANEL
        ========================================== */}

        <div
          className="
            relative
            hidden
            min-h-[600px]
            overflow-hidden
            bg-[#f8dce3]
            md:flex
            md:flex-col
            md:justify-between
          "
        >

          {/* ========================================
              BEAUTY IMAGE
          ======================================== */}

          <img
            src={beautyWoman}
            alt="Aisha Aesthetics Beauty Treatment"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
          />


          {/* ========================================
              IMAGE OVERLAY
          ======================================== */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#f8dce3]/95
              via-[#fff2f4]/55
              to-[#fff5e9]/20
            "
          />


          {/* ========================================
              TOP LOGO
          ======================================== */}

          <div className="relative z-10 p-8 lg:p-10">

            

          </div>


          {/* ========================================
              CENTER CONTENT
          ======================================== */}

          <div className="relative z-10 px-8 pb-10 lg:px-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b88a2c]">
              Aisha Aesthetics
            </p>


            <h1
              className="
                mt-4
                text-4xl
                font-bold
                leading-tight
                text-[#4b343b]
                lg:text-5xl
              "
            >
              Beauty begins
              <br />
              with self-care.
            </h1>


            <p className="mt-4 max-w-sm text-sm leading-6 text-[#80656d]">
              Easily manage your appointments, services, reminders,
              and beauty journey.
            </p>

          </div>


          {/* ========================================
              BOTTOM TEXT
          ======================================== */}

          <div className="relative z-10 px-8 pb-8 lg:px-10">

            <p className="text-xs text-[#9d7c85]">
              Beauty • Aesthetics • Wellness
            </p>

          </div>

        </div>


        {/* ==========================================
            RIGHT SIGN IN PANEL
        ========================================== */}

        <div className="p-6 sm:p-10">

          {/* ========================================
              MOBILE LOGO
          ======================================== */}

          <div className="md:hidden">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[#fff2df]
                text-[#c18c2d]
              "
            >
              <Sparkles size={23} />
            </div>

          </div>


          {/* ========================================
              HEADER
          ======================================== */}

          <div className="mt-8">

            <p className="text-sm font-medium text-[#b88a2c]">
              Welcome Back
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#4b343b]">
              Sign In
            </h2>

            <p className="mt-2 text-sm text-[#92737c]">
              Enter your account details to continue.
            </p>

          </div>


          {/* ========================================
              SIGN IN FORM
          ======================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ======================================
                EMAIL
            ====================================== */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#5c444b]"
              >
                Email Address
              </label>


              <div className="relative">

                <Mail
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#b49aa2]
                  "
                />


                <input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input-field w-full pl-11"
                  required
                />

              </div>

            </div>


            {/* ======================================
                PASSWORD
            ====================================== */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#5c444b]"
              >
                Password
              </label>


              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#b49aa2]
                  "
                />


                <input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="
                    input-field
                    w-full
                    pl-11
                    pr-11
                  "
                  required
                />


                {/* SHOW PASSWORD */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#a78d95]
                    transition
                    hover:text-[#d77992]
                  "
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* ======================================
                FORGOT PASSWORD
            ====================================== */}

            <div className="flex justify-end">

              <button
                type="button"
                className="
                  text-sm
                  font-semibold
                  text-[#d77992]
                  hover:underline
                "
              >
                Forgot password?
              </button>

            </div>


            {/* ======================================
                SIGN IN BUTTON
            ====================================== */}

            <button
              type="submit"
              className="primary-btn w-full disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>





          {/* ========================================
              SIGN UP
          ======================================== */}

          <p className="mt-7 text-center text-sm text-[#92737c]">

            Don't have an account?{' '}

            <Link
              to="/signup"
              className="
                font-bold
                text-[#d77992]
                hover:underline
              "
            >
              Sign up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signin;