import { useState } from 'react';
import { requestPasswordReset, resetPassword } from '../api/auth.api';

export default function ForgotPassword({ initialEmail, onBack }: { initialEmail: string; onBack: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendAt, setResendAt] = useState(0);

  async function sendCode() {
    if (Date.now() < resendAt) {
      setError('Please wait one minute before requesting another code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
      setSent(true);
      setOtp('');
      setResendAt(Date.now() + 60000);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to send the code.');
    } finally { setLoading(false); }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sent) return sendCode();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const result = await resetPassword({ email, otp, password });
      setMessage(result.message);
      setPassword('');
      setConfirmPassword('');
      setOtp('');
      setDone(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to reset your password.');
    } finally { setLoading(false); }
  }

  return <div className="flex min-h-screen items-center justify-center bg-[#fff8fa] px-4 py-8">
    <section className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-8 shadow-xl shadow-pink-100/40">
      <h1 className="text-2xl font-bold text-[#64434e]">{done ? 'Password updated' : 'Forgot password?'}</h1>
      {!done && <p className="mt-3 text-sm text-[#92737c]">{sent ? 'Enter the six-digit code from your email and choose a new password. The code expires in 10 minutes.' : 'Enter the email address registered to your account. We’ll email you a verification code.'}</p>}
      {message && <p role="status" className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {!done && <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-[#64434e]">Email address
          <input type="email" autoComplete="email" required maxLength={254} value={email} disabled={sent || loading}
            onChange={event => setEmail(event.target.value)} className="input-field mt-2 w-full" />
        </label>
        {sent && <>
          <label className="block text-sm font-semibold text-[#64434e]">Verification code
            <input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required
              value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, ''))} className="input-field mt-2 w-full" />
          </label>
          <label className="block text-sm font-semibold text-[#64434e]">New password
            <input type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password}
              onChange={event => setPassword(event.target.value)} className="input-field mt-2 w-full" />
          </label>
          <p className="text-xs text-[#92737c]">Use 8–128 characters.</p>
          <label className="block text-sm font-semibold text-[#64434e]">Confirm new password
            <input type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)} className="input-field mt-2 w-full" />
          </label>
        </>}
        <button type="submit" disabled={loading} className="primary-btn w-full disabled:opacity-60">{loading ? 'Please wait…' : sent ? 'Reset password' : 'Send verification code'}</button>
        {sent && <div className="flex justify-between text-sm font-semibold text-[#d77992]">
          <button type="button" disabled={loading} onClick={() => void sendCode()}>Resend code</button>
          <button type="button" disabled={loading} onClick={() => { setSent(false); setMessage(''); setError(''); setOtp(''); }}>Change email</button>
        </div>}
      </form>}
      <button type="button" disabled={loading} onClick={onBack} className="mt-6 w-full text-sm font-semibold text-[#d77992] hover:underline">Back to sign in</button>
    </section>
  </div>;
}
