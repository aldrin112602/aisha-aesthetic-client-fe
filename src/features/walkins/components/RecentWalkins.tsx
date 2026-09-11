import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, UserRound, X } from 'lucide-react';
import type { WalkinRecord, RecentWalkinsProps } from '../../../types';

const PAGE_SIZE = 10;
const money = (value: number | null) => value === null ? '—' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
const dateLabel = (value: string | null) => {
  if (!value) return 'Date not recorded';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
};
const control = 'inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border border-[#eadde2] bg-white text-[#80636e] transition hover:bg-[#fff4f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c78498] disabled:cursor-not-allowed disabled:opacity-35';

function Status({ value }: { value: string | null }) {
  const colors: Record<string, string> = {
    completed: 'bg-[#edf6f0] text-[#47775a]', pending: 'bg-[#fff7e8] text-[#9c742e]',
    cancelled: 'bg-[#fff0f0] text-[#ad5c62]', confirmed: 'bg-[#eef4fc] text-[#597baf]', ongoing: 'bg-[#f4effb] text-[#8b67b1]',
  };
  return <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium capitalize ${colors[value?.toLowerCase() || ''] || 'bg-gray-100 text-gray-600'}`}>
    <span className="h-1 w-1 shrink-0 rounded-full bg-current" />{value || 'Unknown'}
  </span>;
}

export default function RecentWalkins({ walkins }: RecentWalkinsProps) {
  const [pagination, setPagination] = useState({ records: walkins, page: 1 });
  const [selected, setSelected] = useState<WalkinRecord | null>(null);
  // Reset alongside changed data, without effect-driven intermediate empty pages.
  if (pagination.records !== walkins) setPagination({ records: walkins, page: 1 });
  const totalPages = Math.max(1, Math.ceil(walkins.length / PAGE_SIZE));
  const page = pagination.records === walkins ? Math.min(pagination.page, totalPages) : 1;
  const start = (page - 1) * PAGE_SIZE;
  const rows = walkins.slice(start, start + PAGE_SIZE);
  const goToPage = (next: number) => setPagination({ records: walkins, page: Math.max(1, Math.min(next, totalPages)) });
  const detailButton = (walkin: WalkinRecord) => <button type="button" onClick={() => setSelected(walkin)}
    aria-label={`View details for ${walkin.customerName || 'walk-in customer'}`} className={`${control} gap-1 px-2.5 text-xs font-medium`}>
    View <ArrowUpRight size={14} aria-hidden="true" />
  </button>;
  const customer = (walkin: WalkinRecord) => <div className="flex min-w-0 items-center gap-2.5">
    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f9eef2] text-xs font-semibold text-[#b4788d]">{walkin.customerName?.trim().charAt(0).toUpperCase() || '?'}</span>
    <div className="min-w-0"><p className="truncate text-[13px] font-semibold text-[#49343a]" title={walkin.customerName || undefined}>{walkin.customerName || 'Unknown customer'}</p>
      <p className="mt-0.5 text-[11px] text-[#99828b]">{walkin.phoneNumber || 'No phone number'}</p></div>
  </div>;
  const details = selected ? [
    ['Customer', selected.customerName], ['Phone number', selected.phoneNumber], ['Employee', selected.employeeName],
    ['Service', selected.serviceName], ['Category', selected.category], ['Date', dateLabel(selected.date)],
    ['Time', selected.time], ['Branch', selected.area], ['Amount', money(selected.price)],
    ['Appointment type', selected.appointmentType], ['Status', selected.status], ['Notes', selected.notes],
    ['Created at', selected.createdAt ? new Date(selected.createdAt).toLocaleString('en-PH') : null],
  ] : [];

  return <section className="@container min-w-0 overflow-hidden rounded-2xl border border-[#edE1e6] bg-white shadow-[0_4px_24px_-18px_rgba(85,44,59,0.2)]" aria-labelledby="recent-walkins-heading">
    <header className="flex items-center justify-between gap-3 border-b border-[#f1e8ec] px-4 py-4 sm:px-5">
      <div><h2 id="recent-walkins-heading" className="text-base font-semibold text-[#49343a]">Recent Walk-ins</h2><p className="mt-1 text-xs text-[#99828b]">Customer visits and services at a glance.</p></div>
      <span className="shrink-0 rounded-full bg-[#faf3f6] px-2.5 py-1 text-[11px] font-medium text-[#a27585]">{walkins.length} {walkins.length === 1 ? 'visit' : 'visits'}</span>
    </header>

    {!rows.length ? <div className="px-5 py-14 text-center">
      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#faf0f4] text-[#c18b9e]"><UserRound size={20} /></span>
      <p className="text-sm font-medium text-[#624953]">No walk-ins yet</p><p className="mt-1.5 text-xs text-[#99828b]">Add a walk-in to record your first customer visit.</p>
    </div> : <>
      <div className="hidden @min-[760px]:block">
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">Recent walk-in customers, services, visits, amounts and statuses</caption>
          <thead><tr className="bg-[#fcf9fa] text-[10px] font-medium uppercase tracking-wider text-[#9d8890]">
            <th scope="col" className="w-[25%] px-5 py-3 font-medium">Customer</th><th scope="col" className="w-[23%] px-3 py-3 font-medium">Service</th>
            <th scope="col" className="w-[21%] px-3 py-3 font-medium">Visit</th><th scope="col" className="w-[13%] px-3 py-3 text-right font-medium">Amount</th>
            <th scope="col" className="w-[18%] px-5 py-3 text-right font-medium">Status / Details</th>
          </tr></thead>
          <tbody className="divide-y divide-[#f3ebee]">{rows.map(walkin => <tr key={walkin.id} className="transition hover:bg-[#fffbfc]">
            <td className="px-5 py-4 align-top">{customer(walkin)}</td>
            <td className="px-3 py-4 align-top"><p className="break-words text-[13px] font-medium leading-5 text-[#624953]">{walkin.serviceName || 'Service not recorded'}</p><p className="mt-1 text-[11px] capitalize text-[#99828b]">{walkin.category || 'Uncategorized'}</p></td>
            <td className="px-3 py-4 align-top"><p className="text-xs text-[#715b65]">{dateLabel(walkin.date)}</p><p className="mt-1 text-[11px] text-[#99828b]">{walkin.time || 'Time not recorded'}</p><p className="mt-1 truncate text-[11px] text-[#99828b]" title={walkin.area || undefined}>{walkin.area || 'Branch not recorded'}</p></td>
            <td className="px-3 py-4 text-right align-top text-[13px] font-semibold tabular-nums text-[#70535e]">{money(walkin.price)}</td>
            <td className="px-5 py-3 text-right align-top"><div className="flex flex-col items-end gap-2"><Status value={walkin.status} />{detailButton(walkin)}</div></td>
          </tr>)}</tbody>
        </table>
      </div>

      <div className="divide-y divide-[#f1e8ec] @min-[760px]:hidden">{rows.map(walkin => <article key={walkin.id} className="px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-2">{customer(walkin)}<Status value={walkin.status} /></div>
        <div className="mt-3 flex items-start justify-between gap-4"><div className="min-w-0"><p className="break-words text-[13px] font-medium text-[#624953]">{walkin.serviceName || 'Service not recorded'}</p><p className="mt-1 text-[11px] capitalize text-[#99828b]">{walkin.category || 'Uncategorized'}</p></div><p className="shrink-0 text-[13px] font-semibold tabular-nums text-[#70535e]">{money(walkin.price)}</p></div>
        <div className="mt-3 flex items-end justify-between gap-3"><div className="min-w-0 text-[11px] leading-5 text-[#99828b]"><p>{dateLabel(walkin.date)}{walkin.time ? ` · ${walkin.time}` : ''}</p><p className="flex items-center gap-1"><MapPin size={11} className="shrink-0" /><span className="truncate">{walkin.area || 'Branch not recorded'}</span></p></div>{detailButton(walkin)}</div>
      </article>)}</div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f1e8ec] bg-[#fdfbfc] px-4 py-3 sm:px-5">
        <p className="text-[11px] text-[#99828b]" aria-live="polite">Showing <span className="font-medium text-[#715b65]">{start + 1}–{Math.min(start + PAGE_SIZE, walkins.length)}</span> of {walkins.length}</p>
        {totalPages > 1 && <nav aria-label="Walk-in pagination" className="flex items-center gap-2">
          <button type="button" className={control} disabled={page === 1} onClick={() => goToPage(page - 1)} aria-label="Previous page"><ChevronLeft size={15} /></button>
          <span className="px-1 text-[11px] text-[#80636e]">{page} / {totalPages}</span>
          <button type="button" className={control} disabled={page === totalPages} onClick={() => goToPage(page + 1)} aria-label="Next page"><ChevronRight size={15} /></button>
        </nav>}
      </footer>
    </>}

    <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm" aria-labelledby="walkin-details-title" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle id="walkin-details-title" component="div" sx={{ p: 2.5, borderBottom: '1px solid #f1e8ec' }}>
        <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold text-[#49343a]">Walk-in details</h2><p className="mt-1 text-xs text-[#99828b]">Visit #{selected?.id}</p></div><button type="button" className={control} onClick={() => setSelected(null)} aria-label="Close walk-in details"><X size={16} /></button></div>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}><dl className="divide-y divide-[#f3ebee]">{details.filter(([, value]) => value !== null && value !== '').map(([label, value]) => <div key={label} className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 py-3 sm:grid-cols-[130px_minmax(0,1fr)]"><dt className="text-xs text-[#99828b]">{label}</dt><dd className="whitespace-pre-wrap break-words text-xs font-medium text-[#624953]">{value}</dd></div>)}</dl></DialogContent>
      <DialogActions sx={{ px: 2.5, py: 2, borderTop: '1px solid #f1e8ec' }}><button type="button" onClick={() => setSelected(null)} className="secondary-btn">Close</button></DialogActions>
    </Dialog>
  </section>;
}
