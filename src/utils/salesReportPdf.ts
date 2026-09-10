import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import type { SalesReport } from '../api/salesReport.api';

export interface ReportPdfFilters {
  employee: string;
  service: string;
  appointmentType: string;
}

const money = (value: number) => `PHP ${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function createSalesReportPdf(report: SalesReport, filters: ReportPdfFilters, generatedAt = new Date()) {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  doc.setProperties({ title: 'Aisha Aesthetics - Sales Report', author: 'Aisha Aesthetics' });
  let y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor('#5b3e45');
  doc.text('Aisha Aesthetics', 15, y);
  y += 9;
  doc.setFontSize(15);
  doc.text('Sales Report', 15, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  for (const line of [
    `Period: ${report.startDate} to ${report.endDate}`,
    `Employee: ${filters.employee}`,
    `Service: ${filters.service}`,
    `Booking type: ${filters.appointmentType}`,
    `Generated: ${generatedAt.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} (Philippine time)`,
  ]) {
    const wrapped = doc.splitTextToSize(line, 180) as string[];
    for (const text of wrapped) {
      if (y > 264) { doc.addPage(); y = 22; }
      doc.text(text, 15, y);
      y += 5;
    }
  }
  y += 5;

  function table(title: string, head: string[], rows: (string | number)[][]) {
    // Reserve the title, header and at least one row together.
    if (y > 244) { doc.addPage(); y = 22; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor('#5b3e45');
    doc.text(title, 15, y);
    autoTable(doc, {
      startY: y + 4,
      head: [head],
      body: rows.length ? rows : [[{ content: 'No records for the selected filters.', colSpan: head.length }]],
      margin: { top: 22, bottom: 20, left: 15, right: 15 },
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak', textColor: '#3f3035' },
      headStyles: { fillColor: '#9c5167', textColor: '#ffffff', fontStyle: 'bold' },
      alternateRowStyles: { fillColor: '#fff5f7' },
      columnStyles: head.length === 3
        ? { 0: { cellWidth: 95 }, 1: { cellWidth: 35, halign: 'right' }, 2: { cellWidth: 50, halign: 'right' } }
        : { 0: { cellWidth: 115 }, 1: { cellWidth: 65, halign: 'right' } },
      rowPageBreak: 'avoid',
      showHead: 'everyPage',
      didParseCell: data => { if (data.section === 'head' && data.column.index > 0) data.cell.styles.halign = 'right'; },
      didDrawPage: data => { y = (data.cursor?.y || 22) + 12; },
    });
  }

  const s = report.summary;
  table('Sales Summary', ['Metric', 'Value'], [
    ['Total Sales', money(s.totalSales)], ['Appointment Sales', money(s.appointmentSales)],
    ['Walk-in Sales', money(s.walkinSales)], ['Average Sale', money(s.averageSale)],
    ['Total Transactions', s.totalTransactions], ['Total Appointments', s.totalAppointments], ['Total Walk-ins', s.totalWalkins],
  ]);
  const b = report.bookings;
  table('Booking Status', ['Status', 'Bookings'], [
    ['Total Bookings', b.totalBookings], ['Pending', b.pending], ['Confirmed', b.confirmed],
    ['Completed', b.completed], ['Cancelled', b.cancelled], ['No-show', b.noShow],
  ]);
  table('Daily Sales', ['Date', 'Transactions', 'Sales'], report.dailySales.map(r => [r.date, r.transactions, money(r.sales)]));
  table('Sales by Service', ['Service', 'Transactions', 'Sales'], report.salesByService.map(r => [r.serviceName || 'Unnamed Service', r.transactions, money(r.sales)]));
  table('Sales by Employee', ['Employee', 'Transactions', 'Sales'], report.salesByEmployee.map(r => [r.employeeName || 'Unassigned', r.transactions, money(r.sales)]));

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor('#80656d');
    if (page > 1) doc.text(`Aisha Aesthetics | Sales Report | ${report.startDate} to ${report.endDate}`, 15, 12);
    doc.setDrawColor('#e8c6cf');
    doc.line(15, 282, 195, 282);
    doc.text('Amounts in Philippine pesos (PHP)', 15, 288);
    doc.text(`Page ${page} of ${pages}`, 195, 288, { align: 'right' });
  }
  return doc;
}
