import { useCallback, useEffect, useState } from 'react';
import { Database, Download, RefreshCw, ShieldCheck } from 'lucide-react';
import { createBackup, downloadBackup, getBackups } from '../../api/backups.api';
import type { BackupStatus } from '../../api/backups.api';

const dateLabel = (value: string) => new Date(value).toLocaleString();
const sizeLabel = (bytes: number) => bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;

export default function DatabaseBackupsPage() {
  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refresh = useCallback(async () => {
    try {
      setStatus(await getBackups());
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to load backups.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void refresh());
    const timer = setInterval(() => void refresh(), 30000);
    return () => clearInterval(timer);
  }, [refresh]);

  async function handleCreate() {
    setCreating(true); setError(''); setSuccess('');
    try {
      await createBackup();
      setSuccess('Backup created and verified. You can now download a copy.');
      await refresh();
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to create backup.'); }
    finally { setCreating(false); }
  }

  async function handleDownload(name: string) {
    setDownloading(name); setError('');
    try { await downloadBackup(name); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to download backup.'); }
    finally { setDownloading(null); }
  }

  return (
    <div className="space-y-6 text-[#49343a] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold"><Database aria-hidden="true" /> Database Backups</h1>
          <p className="mt-2 text-sm text-[#70535d]">Keep recovery copies of your accounts, appointments and other database records.</p>
        </div>
        <button onClick={() => void handleCreate()} disabled={loading || creating || status?.busy}
          className="rounded-xl bg-[#49343a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {creating || status?.busy ? 'Creating backup…' : 'Create backup'}
        </button>
      </div>

      {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {success && <div role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-800">{success}</div>}
      {status?.lastError && <div role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{status.lastError}</div>}

      {status && <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-pink-100 bg-white p-5">
          <p className="flex items-center gap-2 text-sm text-[#70535d]"><ShieldCheck size={18} /> Automatic backup</p>
          <p className="mt-2 text-lg font-semibold">{status.enabled ? `Every ${status.intervalHours} hours` : 'Disabled'}</p>
          <p className="mt-1 text-xs text-[#70535d]">Runs while the backend server is online.</p>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-white p-5">
          <p className="text-sm text-[#70535d]">Next automatic backup</p>
          <p className="mt-2 font-semibold">{!status.enabled ? 'Disabled' : status.nextBackupAt ? dateLabel(status.nextBackupAt) : 'Due now'}</p>
          <p className="mt-1 text-xs text-[#70535d]">Overdue backups run when the server starts.</p>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-white p-5">
          <p className="text-sm text-[#70535d]">Backup retention</p>
          <p className="mt-2 text-lg font-semibold">Latest {status.retentionCount} of each type</p>
          <p className="mt-1 text-xs text-[#70535d]">Automatic and manual copies are kept separately.</p>
        </div>
      </div>}

      <div className="rounded-2xl border border-pink-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Saved backups</h2>
          <button onClick={() => void refresh()} disabled={loading} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-pink-50 disabled:opacity-50"><RefreshCw size={16} /> Refresh</button>
        </div>
        {loading ? <p role="status" className="py-8 text-center text-sm">Loading backups…</p> : !status ?
          <p className="py-8 text-center text-sm">Backups could not be loaded. Use Refresh to try again.</p> : status.backups.length === 0 ?
          <p className="py-8 text-center text-sm text-[#70535d]">No saved backups yet. Create your first backup above.</p> :
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead><tr className="border-b border-pink-100 text-[#70535d]"><th className="p-3">Created</th><th className="p-3">Type</th><th className="p-3">Size</th><th className="p-3 text-right">Download</th></tr></thead>
            <tbody>{status.backups.map(backup => <tr key={backup.name} className="border-b border-pink-50 last:border-0">
              <td className="whitespace-nowrap p-3">{dateLabel(backup.createdAt)}</td>
              <td className="p-3 capitalize">{backup.kind}</td><td className="whitespace-nowrap p-3">{sizeLabel(backup.size)}</td>
              <td className="p-3 text-right"><button onClick={() => void handleDownload(backup.name)} disabled={!!downloading}
                aria-label={`Download ${backup.kind} backup from ${dateLabel(backup.createdAt)}`}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-medium hover:bg-pink-50 disabled:opacity-50"><Download size={16} />{downloading === backup.name ? 'Downloading…' : 'Download'}</button></td>
            </tr>)}</tbody>
          </table></div>}
      </div>
      <div className="rounded-2xl bg-[#fff0d8] p-5 text-sm leading-relaxed">
        <p className="font-semibold">Keep a copy outside this server</p>
        <p className="mt-1">Download backups to a separate device or secure cloud storage to protect against disk failure. Backups contain private customer and account data; keep them secure.</p>
        <p className="mt-2">These backups include database records. Uploaded photos are stored separately and need their own backup. To recover a database, stop the backend and have your server administrator restore a verified copy using the recovery steps in the backend README.</p>
      </div>
    </div>
  );
}
