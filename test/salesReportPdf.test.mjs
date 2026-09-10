import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSalesReportPdf } from '../src/utils/salesReportPdf.ts';

export const sampleReport = {
  startDate: '2026-09-01', endDate: '2026-09-30',
  summary: { totalSales: 125000.5, appointmentSales: 100000, walkinSales: 25000.5, averageSale: 1250.01, totalTransactions: 100, totalAppointments: 80, totalWalkins: 20 },
  bookings: { totalBookings: 110, pending: 10, confirmed: 15, completed: 75, cancelled: 5, noShow: 5 },
  dailySales: Array.from({ length: 30 }, (_, i) => ({ date: `2026-09-${String(i + 1).padStart(2, '0')}`, transactions: 3, sales: 1250.5 })),
  salesByService: Array.from({ length: 65 }, (_, i) => ({ serviceName: `Service ${i + 1} - Facial and Skin Rejuvenation Treatment with Extended Consultation`, transactions: i + 1, sales: 2000 })),
  salesByEmployee: [{ employeeName: 'Maria Peña', transactions: 80, sales: 100000 }, { employeeName: '', transactions: 20, sales: 25000.5 }],
};
export const sampleFilters = { employee: 'All employees', service: 'All services', appointmentType: 'All booking types' };

test('PDF includes report values, filters, all rows and page numbering', () => {
  const doc = createSalesReportPdf(sampleReport, sampleFilters, new Date('2026-09-10T04:00:00Z'));
  const pdf = doc.output();
  assert.ok(pdf.startsWith('%PDF-'));
  assert.ok(doc.getNumberOfPages() >= 4);
  for (const text of ['125,000.50', 'All employees', 'Service 65', 'Sales by Employee', 'Unassigned']) assert.ok(pdf.includes(text), text);
  assert.ok(pdf.includes(`Page ${doc.getNumberOfPages()} of ${doc.getNumberOfPages()}`));
});

test('empty report exports valid tables with explicit empty states', () => {
  const pdf = createSalesReportPdf({ ...sampleReport, dailySales: [], salesByService: [], salesByEmployee: [] }, sampleFilters).output();
  assert.equal(pdf.split('No records for the selected filters.').length - 1, 3);
});
