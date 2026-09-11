import BrandLogo from './BrandLogo';
import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { StaffTermsChallenge } from '../api/auth.api';
import TermsReader from './TermsReader';

export default function StaffTermsAgreement({ challenge, onAccept, onCancel, loading, error }: {
  challenge: StaffTermsChallenge; onAccept: () => void; onCancel: () => void; loading: boolean; error: string;
}) {
  const [accepted, setAccepted] = useState(false);
  const [reviewedVersion, setReviewedVersion] = useState('');
  const reviewed = reviewedVersion === challenge.version;
  return <div className="flex min-h-screen items-center justify-center bg-[#fff8fa] px-4 py-8">
    <main className="w-full max-w-3xl rounded-3xl border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/40 sm:p-10">
      <ShieldCheck size={32} className="mb-4 text-[#c26c84]" />
      <BrandLogo className="mb-5 h-20 w-20" />
      <p className="text-xs font-semibold uppercase tracking-widest text-[#b88a2c]">AishaEsthetics · First login</p>
      <h1 className="mt-3 text-2xl font-bold text-[#4b343b]">{challenge.title}</h1>
      <p className="mt-2 text-sm text-[#80656d]">Please review your responsibilities before using your {challenge.role} account.</p>
      <div className="my-6 rounded-2xl border border-pink-100 bg-[#fffafb] p-5">
        <TermsReader key={challenge.version} title={challenge.title} sections={challenge.sections}
          disabled={loading} onReviewed={() => setReviewedVersion(challenge.version)} />
      </div>
      <form onSubmit={event => { event.preventDefault(); if (reviewed && accepted && !loading) onAccept(); }}>
        <label className="flex items-start gap-3 text-sm leading-6 text-[#5c444b]">
          <input type="checkbox" checked={reviewed && accepted} onChange={event => setAccepted(event.target.checked)} required disabled={!reviewed || loading} className="mt-1 h-4 w-4 shrink-0 accent-[#c26c84]" />
          <span>I have read and agree to the {challenge.title} for my account.</span>
        </label>
        <p role="status" className="mt-3 text-xs text-[#92737c]">{reviewed ? 'You can now check the box to agree.' : 'Open and read the terms first to enable the checkbox.'}</p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={loading} className="rounded-xl border border-pink-200 px-5 py-3 text-sm font-semibold text-[#80656d]">Back to sign in</button>
          <button type="submit" disabled={!reviewed || !accepted || loading} className="primary-btn disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Saving agreement...' : 'Accept and continue'}</button>
        </div>
      </form>
    </main>
  </div>;
}
