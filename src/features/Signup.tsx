import BrandLogo from '../components/BrandLogo';
import { LockKeyhole, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCustomerTerms, signup } from '../api/auth.api';
import type { CustomerTerms } from '../api/auth.api';
import TermsReader from '../components/TermsReader';

function Signup() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<CustomerTerms | null>(null);
  const [termsError, setTermsError] = useState('');
  const [termsRetry, setTermsRetry] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [reviewedVersion, setReviewedVersion] = useState('');
  const reviewed = !!terms && reviewedVersion === terms.version;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getCustomerTerms().then(data => {
      if (active) { setTerms(data); setTermsError(''); }
    }).catch(() => {
      if (active) setTermsError('Unable to load the terms. Please try again before signing up.');
    });
    return () => { active = false; };
  }, [termsRetry]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!terms || !reviewed || !accepted || loading) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError('');
    try {
      await signup({ name: String(form.get('name') || ''), email: String(form.get('email') || ''),
        password, confirmPassword, acceptedTerms: accepted, termsVersion: terms.version });
      navigate('/signin', { replace: true, state: { signupSuccess: true } });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create your account.');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8fa] px-4 py-8">
      <div className="w-full max-w-xl rounded-3xl border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/40 sm:p-10">
        

        <div className="mt-6 text-center">
          <BrandLogo className="mx-auto mb-4 h-24 w-24" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b88a2c]">
            AishaEsthetics
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
                name="name"
                autoComplete="name"
                maxLength={100}
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
                name="email"
                autoComplete="email"
                maxLength={254}
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
                name="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
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
                name="confirmPassword"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          {terms ? <div className="rounded-xl border border-pink-100 bg-[#fffafb] p-4">
            <TermsReader key={terms.version} title={terms.title} sections={terms.sections} disabled={loading}
              onReviewed={() => { setReviewedVersion(terms.version); setAccepted(false); }} />
          </div> : termsError ? <div role="alert" className="text-sm text-red-700">
            {termsError} <button type="button" className="font-semibold underline" onClick={() => setTermsRetry(value => value + 1)}>Retry</button>
          </div> : <p role="status" className="text-sm text-[#80656d]">Loading customer terms…</p>}

          <label className="flex items-start gap-3 text-sm text-[#80656d]">
            <input
              type="checkbox"
              checked={reviewed && accepted}
              onChange={event => setAccepted(event.target.checked)}
              disabled={!reviewed || loading}
              required
              className="mt-1 h-4 w-4 accent-[#df7f98]"
            />

            <span>
              I agree to the Customer Terms & Conditions.
            </span>
          </label>

          <p role="status" className="text-xs text-[#92737c]">{reviewed ? 'You can now check the box to agree.' : 'Open and read the terms first to enable the checkbox.'}</p>

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={!reviewed || !accepted || loading} className="primary-btn w-full disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
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
