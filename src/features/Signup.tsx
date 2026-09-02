import { LockKeyhole, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Temporary only. Later, replace with Supabase Auth.
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8fa] px-4 py-8">
      <div className="w-full max-w-xl rounded-3xl border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/40 sm:p-10">
        

        <div className="mt-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b88a2c]">
            Aisha Aesthetics
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#4b343b]">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-[#92737c]">
            Sign up to book and manage your appointments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#5c444b]">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b49aa2]"
              />

              <input
                type="text"
                placeholder="Enter your full name"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

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
                type="password"
                placeholder="Create a password"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5c444b]">
              Confirm Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b49aa2]"
              />

              <input
                type="password"
                placeholder="Confirm your password"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-[#80656d]">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 accent-[#df7f98]"
            />

            <span>
              I agree to the{' '}
              <button type="button" className="font-semibold text-[#d77992]">
                Terms & Conditions
              </button>{' '}
              and Privacy Policy.
            </span>
          </label>

          <button type="submit" className="primary-btn w-full">
            Create Account
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#92737c]">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-bold text-[#d77992] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;