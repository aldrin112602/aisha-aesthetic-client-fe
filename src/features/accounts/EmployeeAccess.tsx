import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/client';

type Policy = { mode: 'on' | 'off' | 'auto'; days: string; startTime: string; endTime: string; until: number | null; allowed: boolean };
export default function EmployeeAccess({ id, name, onClose }: { id: number; name: string; onClose: () => void }) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    apiRequest<Policy>(`/api/users/${id}/access`).then(value => { if (active) setPolicy(value); })
      .catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [id]);
  const change = (patch: Partial<Policy>) => { setPolicy(p => p && { ...p, ...patch }); setSaved(false); };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="access-title" className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between"><h2 id="access-title" className="text-xl font-bold">Duty access — {name}</h2><button type="button" onClick={onClose} disabled={saving} aria-label="Close duty access">✕</button></div>
      <p className="mb-4 text-sm text-gray-600">All times use Philippine time (Asia/Manila). Saving signs this employee out on all devices. They must sign in again when access is allowed.</p>
      {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
      {saved && <p role="status" className="mb-3 text-sm text-green-700">Saved. Access is currently {policy?.allowed ? 'allowed' : 'blocked'}.</p>}
      {!policy ? <p>Loading access settings...</p> : <form className="space-y-4" onSubmit={async e => {
        e.preventDefault(); setSaving(true); setError(''); setSaved(false);
        try {
          const { mode, days, startTime, endTime, until } = policy;
          setPolicy(await apiRequest<Policy>(`/api/users/${id}/access`, { method: 'PUT', body: { mode, days, startTime, endTime, until: mode === 'on' ? until : null } }));
          setSaved(true);
        } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save access.'); }
        finally { setSaving(false); }
      }}>
        <fieldset disabled={saving} className="space-y-4">
          <label className="block text-sm font-semibold">Login access
            <select className="mt-2 w-full rounded-lg border p-2" value={policy.mode} onChange={e => change({ mode: e.target.value as Policy['mode'] })}>
              <option value="on">On — allow login</option><option value="off">Off — block login</option><option value="auto">Automatic — follow duty schedule</option>
            </select>
          </label>
          {policy.mode === 'on' && <label className="block text-sm font-semibold">Automatically turn off at (optional, Philippine time)
            <input type="datetime-local" className="mt-2 w-full rounded-lg border p-2" value={policy.until ? new Date(policy.until + 8 * 3600000).toISOString().slice(0, 16) : ''} onChange={e => change({ until: e.target.value ? Date.parse(`${e.target.value}:00+08:00`) : null })} />
            <span className="mt-1 block font-normal text-gray-600">Leave empty to keep access on until an admin turns it off.</span>
          </label>}
          {policy.mode === 'auto' && <>
            <fieldset><legend className="mb-2 text-sm font-semibold">Duty start days</legend><div className="flex flex-wrap gap-3">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => <label key={day} className="text-sm"><input type="checkbox" checked={policy.days.split(',').includes(String(i))} onChange={e => {
              const days = new Set(policy.days.split(',').filter(Boolean));
              if (e.target.checked) days.add(String(i)); else days.delete(String(i));
              change({ days: [...days].sort().join(',') });
            }} /> {day}</label>)}</div></fieldset>
            <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Start<input required type="time" className="mt-2 w-full rounded-lg border p-2" value={policy.startTime} onChange={e => change({ startTime: e.target.value })} /></label><label className="text-sm font-semibold">End<input required type="time" className="mt-2 w-full rounded-lg border p-2" value={policy.endTime} onChange={e => change({ endTime: e.target.value })} /></label></div>
            <p className="text-sm text-gray-600">Repeats weekly. If end time is earlier than start, duty ends the next day. Access opens automatically at the next scheduled duty; the employee signs in again.</p>
          </>}
          <div className="flex justify-end gap-2"><button type="button" className="secondary-btn" onClick={onClose}>Close</button><button className="primary-btn" type="submit">{saving ? 'Saving...' : 'Save access'}</button></div>
        </fieldset>
      </form>}
    </section>
  </div>;
}
