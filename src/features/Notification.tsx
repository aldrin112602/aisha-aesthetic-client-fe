import { useState } from 'react';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { clearCurrentUser } from '../utils/auth';

export default function Notification() {
  const { notifications, unreadCount, loading, error, refresh, markRead } = useNotifications();
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  async function read(id?: number) {
    setSaving(true);
    setActionError('');
    try { await markRead(id); }
    catch (reason) { setActionError(reason instanceof Error ? reason.message : 'Unable to mark notifications as read.'); }
    finally { setSaving(false); }
  }
  return <div className="page-container">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">Your booking updates and appointment reminders.</p></div>
      <div className="flex gap-4">
        <button onClick={() => void refresh()} className="flex items-center gap-2 text-sm font-semibold text-[#d77992]"><RefreshCw size={17} />Refresh</button>
        <button disabled={saving || !unreadCount || !!error} onClick={() => void read()} className="flex items-center gap-2 text-sm font-semibold text-[#d77992] disabled:opacity-40"><CheckCheck size={17} />Mark all as read</button>
      </div>
    </div>
    {(error || actionError) && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {error || actionError} {error.includes('sign in') && <Link to="/signin" onClick={clearCurrentUser} className="underline">Sign in again</Link>}
    </div>}
    {loading ? <p role="status" className="text-[#80656d]">Loading notifications…</p> : !error && notifications.length === 0 ?
      <div className="pink-card text-center text-[#80656d]"><Bell className="mx-auto mb-3" />No notifications yet. Booking updates will appear here.</div> : null}
    <div className="space-y-3">
      {notifications.map(notification => <article key={notification.id} className={`flex gap-4 rounded-2xl border p-5 shadow-sm ${!notification.readAt ? 'border-pink-200 bg-[#fffafb]' : 'border-pink-100 bg-white'}`}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff2df] text-[#c18c2d]"><Bell size={20} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2"><h2 className="font-semibold text-[#4b343b]">{notification.title}</h2>{!notification.readAt && <span className="text-xs font-semibold text-[#d77992]">Unread</span>}</div>
          <p className="mt-2 text-sm leading-6 text-[#80656d]">{notification.message}</p>
          <time dateTime={notification.createdAt} className="mt-3 block text-xs text-[#aa9198]">{new Date(notification.createdAt).toLocaleString()}</time>
          {!notification.readAt && <button disabled={saving} onClick={() => void read(notification.id)} className="mt-3 text-sm font-semibold text-[#d77992] hover:underline disabled:opacity-40">Mark as read</button>}
        </div>
      </article>)}
    </div>
  </div>;
}
