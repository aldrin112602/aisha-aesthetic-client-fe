import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Temporary only. Later, replace with Supabase Auth.
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8fa] px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-xl shadow-pink-100/40 md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-[#f8dce3] via-[#fff2f4] to-[#fff5e9] p-10 md:flex md:flex-col md:justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-[#c18c2d]">
            <Sparkles size={24} />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b88a2c]">
              Aisha Aesthetics
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-[#4b343b]">
              Beauty begins
              <br />
              with self-care.
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#80656d]">
              Easily manage your appointments, services, reminders, and beauty
              journey.
            </p>
          </div>

          <p className="text-xs text-[#9d7c85]">
            Beauty • Aesthetics • Wellness
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="md:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2df] text-[#c18c2d]">
              <Sparkles size={23} />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium text-[#b88a2c]">Welcome Back</p>
            <h2 className="mt-2 text-3xl font-bold text-[#4b343b]">Sign In</h2>
            <p className="mt-2 text-sm text-[#92737c]">
              Enter your account details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#5c444b]">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b49aa2]"
                />

                <input
                  type="email"
                  placeholder="you@email.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#5c444b]">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b49aa2]"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input-field pl-11 pr-11"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a78d95]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-[#d77992] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="primary-btn w-full">
              Sign In
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#92737c]">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-[#d77992] hover:underline"
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