import EmployeePerformanceChart from './components/EmployeePerformanceChart';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  BarChart3,
  CalendarDays,
  DollarSign,
  Filter,
  FileDown,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Users,
  FileSpreadsheet,
} from 'lucide-react';

import Swal from 'sweetalert2';

import writeExcelFile, { type SheetData } from 'write-excel-file/browser';

import {
  getSalesReport,
  getEmployeeOptions,
  getServiceOptions,
  type SalesReport,
  type EmployeeOption,
  type ServiceOption,
} from '../../api/salesReport.api';

import {
  PieChart,
  pieClasses,
} from '@mui/x-charts/PieChart';

import Box from '@mui/material/Box';

import { styled } from '@mui/material/styles';

import { useDrawingArea } from '@mui/x-charts/hooks';

const StyledText = styled('text')({
  fill: '#5b3e45',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 24,
  fontWeight: 700,
});

const PieCenterLabel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    width,
    height,
    left,
    top,
  } = useDrawingArea();

  return (
    <StyledText
      x={left + width / 2}
      y={top + height / 2}
    >
      {children}
    </StyledText>
  );
};

type FilterMode = 'month' | 'range';

const SalesReportPage: React.FC = () => {

  // ==========================================
  // FILTER STATE
  // ==========================================

  const [filterMode, setFilterMode] =
    useState<FilterMode>('month');

  const [selectedMonth, setSelectedMonth] =
    useState(() => {
      return new Date()
        .toISOString()
        .slice(0, 7);
    });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [employeeId, setEmployeeId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [appointmentType, setAppointmentType] =
    useState<'' | 'appointment' | 'walkin'>('');

  const [employees, setEmployees] = useState<
    EmployeeOption[]
  >([]);

  const [services, setServices] = useState<
    ServiceOption[]
  >([]);

  const [report, setReport] =
    useState<SalesReport | null>(null);

  const [loading, setLoading] =
    useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [loadedFilterKey, setLoadedFilterKey] = useState('');
  const filterKey = JSON.stringify([filterMode, selectedMonth, startDate, endDate, employeeId, serviceId, appointmentType]);
  const reportRequest = useRef(0);

  // ==========================================
  // LOAD FILTER OPTIONS (ONCE)
  // ==========================================

  useEffect(() => {
    getEmployeeOptions()
      .then(setEmployees)
      .catch((error) =>
        console.error(
          'Failed to load employees:',
          error
        )
      );

    getServiceOptions()
      .then(setServices)
      .catch((error) =>
        console.error(
          'Failed to load services:',
          error
        )
      );
  }, []);

  // ==========================================
  // LOAD SALES REPORT
  // ==========================================

  const loadSalesReport = async () => {
    const request = ++reportRequest.current;
    if (
      filterMode === 'range' &&
      (!startDate || !endDate)
    ) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getSalesReport({
        month:
          filterMode === 'month'
            ? selectedMonth
            : undefined,
        startDate:
          filterMode === 'range'
            ? startDate
            : undefined,
        endDate:
          filterMode === 'range'
            ? endDate
            : undefined,
        employeeId: employeeId || undefined,
        serviceId: serviceId || undefined,
        appointmentType:
          appointmentType || undefined,
      });

      if (request !== reportRequest.current) return;
      setReport(data);
      setLoadedFilterKey(filterKey);
    } catch (error) {
      if (request !== reportRequest.current) return;
      setLoadedFilterKey('');
      console.error(
        'Failed to load sales report:',
        error
      );

      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Report',
        text:
          error instanceof Error
            ? error.message
            : 'Unable to fetch the sales report.',
        confirmButtonColor: '#c26c84',
      });
    } finally {
      if (request === reportRequest.current) setLoading(false);
    }
  };

  // ==========================================
  // RELOAD WHEN FILTERS CHANGE
  // ==========================================

  useEffect(() => {
    loadSalesReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterMode,
    selectedMonth,
    startDate,
    endDate,
    employeeId,
    serviceId,
    appointmentType,
  ]);

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const handleResetFilters = () => {
    setFilterMode('month');
    setSelectedMonth(
      new Date().toISOString().slice(0, 7)
    );
    setStartDate('');
    setEndDate('');
    setEmployeeId('');
    setServiceId('');
    setAppointmentType('');
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (
    value: number
  ) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(Number(value || 0));
  };

  // ==========================================
  // FORMAT PERIOD LABEL
  // ==========================================

  const formattedPeriod = useMemo(() => {
    if (filterMode === 'range') {
      if (!startDate || !endDate) {
        return 'selected range';
      }

      const from = new Date(
        `${startDate}T00:00:00`
      ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const to = new Date(
        `${endDate}T00:00:00`
      ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return `${from} – ${to}`;
    }

    if (!selectedMonth) {
      return '';
    }

    const date = new Date(
      `${selectedMonth}-01T00:00:00`
    );

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'long',
        year: 'numeric',
      }
    );
  }, [
    filterMode,
    selectedMonth,
    startDate,
    endDate,
  ]);

  // ==========================================
  // MAX DAILY SALES
  // ==========================================

  const maxDailySales = useMemo(() => {
    if (
      !report?.dailySales?.length
    ) {
      return 0;
    }

    return Math.max(
      ...report.dailySales.map(
        (item) =>
          Number(item.sales || 0)
      )
    );
  }, [report]);

  // ==========================================
  // TOTAL SERVICE TRANSACTIONS
  // ==========================================

  const totalServiceTransactions =
    useMemo(() => {
      if (
        !report?.salesByService?.length
      ) {
        return 0;
      }

      return report.salesByService.reduce(
        (total, item) =>
          total +
          Number(item.transactions || 0),
        0
      );
    }, [report]);

  // ==========================================
  // EMPTY REPORT SAFETY
  // ==========================================

  const summary =
    report?.summary;

  const bookings =
    report?.bookings;

  const appointmentStatusData = useMemo(() => {
    const data = [
      {
        id: 'pending',
        label: 'Pending',
        value: Number(bookings?.pending || 0),
        color: '#b7c95a',
      },
      {
        id: 'confirmed',
        label: 'Confirmed',
        value: Number(bookings?.confirmed || 0),
        color: '#e78aa5',
      },
      {
        id: 'completed',
        label: 'Completed',
        value: Number(bookings?.completed || 0),
        color: '#55a178',
      },
      {
        id: 'cancelled',
        label: 'Cancelled',
        value: Number(bookings?.cancelled || 0),
        color: '#ef4444',
      },
      {
        id: 'no-show',
        label: 'No-show',
        value: Number(bookings?.noShow || 0),
        color: '#8b5cf6',
      },
    ];

    return data.filter(
      (item) => item.value > 0
    );
  }, [bookings]);

  // ==========================================
  // EXPORT TO EXCEL
  // ==========================================

  const handleExportExcel = async () => {
    if (!report) {
      return;
    }

    const summaryRows = [
      { Metric: 'Period', Value: formattedPeriod },
      { Metric: 'Total Sales', Value: summary?.totalSales || 0 },
      { Metric: 'Appointment Sales', Value: summary?.appointmentSales || 0 },
      { Metric: 'Walk-in Sales', Value: summary?.walkinSales || 0 },
      { Metric: 'Average Sale', Value: summary?.averageSale || 0 },
      { Metric: 'Total Transactions', Value: summary?.totalTransactions || 0 },
      { Metric: 'Total Appointments', Value: summary?.totalAppointments || 0 },
      { Metric: 'Total Walk-ins', Value: summary?.totalWalkins || 0 },
      { Metric: 'Pending Bookings', Value: bookings?.pending || 0 },
      { Metric: 'Confirmed Bookings', Value: bookings?.confirmed || 0 },
      { Metric: 'Completed Bookings', Value: bookings?.completed || 0 },
      { Metric: 'Cancelled Bookings', Value: bookings?.cancelled || 0 },
      { Metric: 'No-show Bookings', Value: bookings?.noShow || 0 },
    ];

    const dailyRows = (report.dailySales || []).map(
      (item) => ({
        Date: item.date,
        Sales: item.sales,
        Transactions: item.transactions,
      })
    );

    const serviceRows = (report.salesByService || []).map(
      (item) => ({
        Service: item.serviceName,
        Sales: item.sales,
        Transactions: item.transactions,
      })
    );

    const employeeRows = (report.salesByEmployee || []).map(
      (item) => ({
        Employee: item.employeeName,
        Sales: item.sales,
        Transactions: item.transactions,
      })
    );

    const makeSheet = (rows: Record<string, string | number>[], headers: string[]): SheetData => [
      headers.map(value => ({ value, fontWeight: 'bold' as const })),
      ...rows.map(row => headers.map(key => ({ value: row[key] ?? '' }))),
    ];

    const fileLabel =
      filterMode === 'range' && startDate && endDate
        ? `${startDate}_to_${endDate}`
        : selectedMonth;

    try {
      await writeExcelFile([
        { sheet: 'Summary', data: makeSheet(summaryRows, ['Metric', 'Value']) },
        { sheet: 'Daily Sales', data: makeSheet(dailyRows, ['Date', 'Sales', 'Transactions']) },
        { sheet: 'Sales by Service', data: makeSheet(serviceRows, ['Service', 'Sales', 'Transactions']) },
        { sheet: 'Sales by Employee', data: makeSheet(employeeRows, ['Employee', 'Sales', 'Transactions']) },
      ]).toFile(`sales-report-${fileLabel}.xlsx`);
    } catch {
      alert('Unable to export the Excel report. Please try again.');
    }
  };

  // ==========================================
  // PRINT / SAVE AS PDF
  // ==========================================

  const handleExportPdf = async () => {
    if (!report || loading || exportingPdf || loadedFilterKey !== filterKey) return;
    setExportingPdf(true);
    try {
      const { createSalesReportPdf } = await import('../../utils/salesReportPdf');
      const doc = createSalesReportPdf(report, {
        employee: employees.find(item => String(item.id) === employeeId)?.name || (employeeId ? 'Employee #' + employeeId : 'All employees'),
        service: services.find(item => String(item.id) === serviceId)?.name || (serviceId ? 'Service #' + serviceId : 'All services'),
        appointmentType: appointmentType === 'walkin' ? 'Walk-in' : appointmentType === 'appointment' ? 'Appointment' : 'All booking types',
      });
      await doc.save('sales-report-' + report.startDate + '-to-' + report.endDate + '.pdf', { returnPromise: true });
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'PDF export failed', text: error instanceof Error ? error.message : 'Unable to generate the PDF.', confirmButtonColor: '#c26c84' });
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <>
      <div className="screen-report min-h-screen bg-[#fff8fa] p-4 md:p-6 lg:p-8">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#5b3e45] md:text-3xl">
            Sales Report
          </h1>

          <p className="mt-1 text-sm text-[#92737c]">
            Sales and booking performance for{' '}
            {formattedPeriod}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 no-print">

          {/* REFRESH */}

          <button
            type="button"
            onClick={loadSalesReport}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c26c84] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b45d75] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />

            {loading
              ? 'Loading...'
              : 'Refresh'}
          </button>

          {/* EXPORT TO EXCEL */}

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!report}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3f8f5f] bg-white px-4 py-2.5 text-sm font-semibold text-[#3f8f5f] shadow-sm transition hover:bg-[#eaf6ef] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileSpreadsheet size={17} />
            Export Excel
          </button>

          {/* PRINT / PDF */}

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!report || loading || exportingPdf || loadedFilterKey !== filterKey}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c26c84] bg-white px-4 py-2.5 text-sm font-semibold text-[#c26c84] shadow-sm transition hover:bg-[#fdecef] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileDown size={17} />
            {exportingPdf ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* ======================================
          FILTERS
      ======================================= */}

      <div className="mb-6 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm no-print">

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#c26c84]" />
            <h2 className="text-lg font-bold text-[#5b3e45]">
              Filters
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#92737c] transition hover:text-[#c26c84]"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* PERIOD MODE */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
              Period
            </label>

            <select
              value={filterMode}
              onChange={(event) =>
                setFilterMode(
                  event.target.value as FilterMode
                )
              }
              className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm font-medium text-[#5b3e45] outline-none focus:border-[#c26c84]"
            >
              <option value="month">By Month</option>
              <option value="range">Date Range</option>
            </select>
          </div>

          {/* MONTH OR DATE RANGE */}

          {filterMode === 'month' ? (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                Month
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-pink-100 bg-white px-3 py-2">
                <CalendarDays
                  size={16}
                  className="shrink-0 text-[#c26c84]"
                />

                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(event) =>
                    setSelectedMonth(
                      event.target.value
                    )
                  }
                  className="w-full bg-transparent text-sm font-medium text-[#5b3e45] outline-none"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  From
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                  className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm font-medium text-[#5b3e45] outline-none focus:border-[#c26c84]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  To
                </label>

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                  className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm font-medium text-[#5b3e45] outline-none focus:border-[#c26c84]"
                />
              </div>
            </>
          )}

          {/* EMPLOYEE */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
              Employee
            </label>

            <select
              value={employeeId}
              onChange={(event) =>
                setEmployeeId(event.target.value)
              }
              className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm font-medium text-[#5b3e45] outline-none focus:border-[#c26c84]"
            >
              <option value="">All Employees</option>
              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* SERVICE */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
              Service
            </label>

            <select
              value={serviceId}
              onChange={(event) =>
                setServiceId(event.target.value)
              }
              className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm font-medium text-[#5b3e45] outline-none focus:border-[#c26c84]"
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                >
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* APPOINTMENT TYPE */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#92737c]">
              Type
            </label>

            <select
              value={appointmentType}
              onChange={(event) =>
                setAppointmentType(
                  event.target.value as
                    | ''
                    | 'appointment'
                    | 'walkin'
                )
              }
              className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm font-medium text-[#5b3e45] outline-none focus:border-[#c26c84]"
            >
              <option value="">All Types</option>
              <option value="appointment">Appointment</option>
              <option value="walkin">Walk-in</option>
            </select>
          </div>

        </div>
      </div>

      {/* ======================================
          LOADING
      ======================================= */}

      {loading && !report ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-pink-100 bg-white shadow-sm">
          <div className="text-center">
            <RefreshCw
              size={35}
              className="mx-auto mb-3 animate-spin text-[#c26c84]"
            />

            <p className="text-sm font-medium text-[#5b3e45]">
              Loading sales report...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ======================================
              REVENUE CARDS
          ======================================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL SALES */}

            <div className="print-card rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fdecef] text-[#c26c84]">
                  <DollarSign size={21} />
                </div>
              </div>

              <p className="text-sm text-[#92737c]">
                Total Sales
              </p>

              <p className="mt-1 text-2xl font-bold text-[#5b3e45]">
                {formatCurrency(
                  summary?.totalSales || 0
                )}
              </p>

              <p className="mt-1 text-xs text-[#92737c]">
              Confirmed and completed transactions
            </p>
            </div>

            {/* APPOINTMENT SALES */}

            <div className="print-card rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee8ff] text-[#8067b7]">
                  <CalendarDays size={21} />
                </div>
              </div>

              <p className="text-sm text-[#92737c]">
                Appointment Sales
              </p>

              <p className="mt-1 text-2xl font-bold text-[#5b3e45]">
                {formatCurrency(
                  summary?.appointmentSales ||
                    0
                )}
              </p>

              <p className="mt-1 text-xs text-[#92737c]">
                {summary?.totalAppointments ||
                  0}{' '}
                completed appointments
              </p>
            </div>

            {/* WALK-IN SALES */}

            <div className="print-card rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f5ed] text-[#4f9671]">
                  <Users size={21} />
                </div>
              </div>

              <p className="text-sm text-[#92737c]">
                Walk-in Sales
              </p>

              <p className="mt-1 text-2xl font-bold text-[#5b3e45]">
                {formatCurrency(
                  summary?.walkinSales ||
                    0
                )}
              </p>

              <p className="mt-1 text-xs text-[#92737c]">
                {summary?.totalWalkins ||
                  0}{' '}
                completed walk-ins
              </p>
            </div>

            {/* AVERAGE SALE */}

            <div className="print-card rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6f0ff] text-[#5680bb]">
                  <TrendingUp size={21} />
                </div>
              </div>

              <p className="text-sm text-[#92737c]">
                Average Sale
              </p>

              <p className="mt-1 text-2xl font-bold text-[#5b3e45]">
                {formatCurrency(
                  summary?.averageSale || 0
                )}
              </p>

              <p className="mt-1 text-xs text-[#92737c]">
                Per confirmed/completed transaction
              </p>
            </div>
          </div>

          {/* ======================================
              SALES BREAKDOWN
          ======================================= */}

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* SALES BY TYPE */}

            <div className="print-card rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#5b3e45]">
                  Sales Breakdown
                </h2>

                <p className="text-sm text-[#92737c]">
                  Appointment vs Walk-in revenue
                </p>
              </div>

              <div className="space-y-5">

                {/* APPOINTMENTS */}

                <div>
                  <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#8067b7]" />

                      <span className="text-sm font-medium text-[#5b3e45]">
                        Appointments
                      </span>
                    </div>

                    <span className="text-sm font-bold text-[#5b3e45]">
                      {formatCurrency(
                        summary?.appointmentSales ||
                          0
                      )}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#f4edf0]">
                    <div
                      className="h-full rounded-full bg-[#8067b7] transition-all"
                      style={{
                        width:
                          summary?.totalSales
                            ? `${Math.min(
                                100,
                                ((summary.appointmentSales ||
                                  0) /
                                  summary.totalSales) *
                                  100
                              )}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* WALK-INS */}

                <div>
                  <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#4f9671]" />

                      <span className="text-sm font-medium text-[#5b3e45]">
                        Walk-ins
                      </span>
                    </div>

                    <span className="text-sm font-bold text-[#5b3e45]">
                      {formatCurrency(
                        summary?.walkinSales ||
                          0
                      )}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#f4edf0]">
                    <div
                      className="h-full rounded-full bg-[#4f9671] transition-all"
                      style={{
                        width:
                          summary?.totalSales
                            ? `${Math.min(
                                100,
                                ((summary.walkinSales ||
                                  0) /
                                  summary.totalSales) *
                                  100
                              )}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ======================================
                APPOINTMENT STATUS
            ======================================= */}

            <div className="print-card rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

              <div className="mb-2">
                <h2 className="text-lg font-bold text-[#5b3e45]">
                  Appointment Status
                </h2>

                <p className="text-sm text-[#92737c]">
                  Appointment distribution for {formattedPeriod}
                </p>
              </div>

              {appointmentStatusData.length > 0 ? (
                <>
                  <Box
                    sx={{
                      width: '100%',
                      height: 280,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <PieChart
                      series={[
                        {
                          data: appointmentStatusData,
                          innerRadius: 72,
                          outerRadius: 112,
                          paddingAngle: 3,
                          cornerRadius: 5,

                          highlightScope: {
                            fade: 'global',
                            highlight: 'item',
                          },

                          faded: {
                            innerRadius: 66,
                            additionalRadius: -5,
                          },

                          arcLabel: (item) => {
                            const total = Number(
                              bookings?.totalBookings || 0
                            );

                            if (!total) {
                              return '';
                            }

                            const percentage =
                              (item.value / total) * 100;

                            return percentage >= 5
                              ? `${percentage.toFixed(0)}%`
                              : '';
                          },

                          valueFormatter: ({
                            value,
                          }) => {
                            const total = Number(
                              bookings?.totalBookings || 0
                            );

                            const percentage =
                              total > 0
                                ? (
                                    (Number(value) /
                                      total) *
                                    100
                                  ).toFixed(1)
                                : '0';

                            return `${value} appointments (${percentage}%)`;
                          },
                        },
                      ]}
                      colors={appointmentStatusData.map(
                        (item) => item.color
                      )}
                      hideLegend
                      sx={{
                        [`& .${pieClasses.arcLabel}`]: {
                          fontSize: '12px',
                          fontWeight: 700,
                          fill: '#ffffff',
                        },
                      }}
                    >
                      <PieCenterLabel>
                        {Number(
                          bookings?.totalBookings || 0
                        )}
                      </PieCenterLabel>
                    </PieChart>
                  </Box>

                  {/* LEGEND */}

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                    {appointmentStatusData.map(
                      (item) => {
                        const total = Number(
                          bookings?.totalBookings || 0
                        );

                        const percentage =
                          total > 0
                            ? (item.value / total) * 100
                            : 0;

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 rounded-xl bg-[#fff9fb] px-3 py-2"
                          >
                            <span
                              className="h-3 w-3 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  item.color,
                              }}
                            />

                            <div className="min-w-0">
                              <p className="truncate text-xs text-[#92737c]">
                                {item.label}
                              </p>

                              <p className="text-sm font-bold text-[#5b3e45]">
                                {item.value}{' '}
                                <span className="font-normal text-[#92737c]">
                                  ({percentage.toFixed(0)}%)
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}

                  </div>
                </>
              ) : (
                <div className="flex h-[280px] items-center justify-center text-center">
                  <div>
                    <CalendarDays
                      size={36}
                      className="mx-auto mb-3 text-[#d8b8c1]"
                    />

                    <p className="font-medium text-[#5b3e45]">
                      No appointment data
                    </p>

                    <p className="mt-1 text-sm text-[#92737c]">
                      No appointments found for this period.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ======================================
              DAILY SALES
          ======================================= */}

          <div className="print-card mb-6 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#5b3e45]">
                  Daily Sales
                </h2>

                <p className="text-sm text-[#92737c]">
                  Revenue generated each day
                </p>
              </div>

              <BarChart3
                size={21}
                className="text-[#c26c84]"
              />
            </div>

            {!report?.dailySales?.length ? (
              <div className="py-12 text-center">
                <BarChart3
                  size={35}
                  className="mx-auto mb-3 text-[#d8b8c1]"
                />

                <p className="text-sm text-[#92737c]">
                  No sales recorded for this period.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {report.dailySales.map((item, index) => {
                  const percentage = maxDailySales
                    ? (Number(item.sales || 0) / maxDailySales) * 100
                    : 0;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <div className="w-20 shrink-0 text-xs font-medium text-[#92737c]">
                        {item.date
                          ? new Date(item.date).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' }
                            )
                          : `Day ${index + 1}`}
                      </div>

                      <div className="h-8 flex-1 overflow-hidden rounded-lg bg-[#f4edf0]">
                        <div
                          className="flex h-full items-center rounded-lg bg-[#c26c84] px-3 text-xs font-semibold text-white transition-all"
                          style={{
                            width: `${Math.max(
                              percentage,
                              Number(item.sales || 0) > 0
                                ? 8
                                : 0
                            )}%`,
                          }}
                        >
                          {Number(item.transactions || 0)}{' '}
                          {Number(item.transactions || 0) === 1
                            ? 'transaction'
                            : 'transactions'}
                        </div>
                      </div>

                      <div className="w-28 shrink-0 text-right text-xs font-semibold text-[#5b3e45]">
                        {formatCurrency(Number(item.sales || 0))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ======================================
              SALES BY SERVICE
          ======================================= */}

          <div className="print-card mb-6 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#5b3e45]">
                  Sales by Service
                </h2>

                <p className="text-sm text-[#92737c]">
                  Top performing services
                </p>
              </div>

              <ShoppingBag
                size={21}
                className="text-[#c26c84]"
              />
            </div>

            {!report?.salesByService
              ?.length ? (
              <div className="py-10 text-center">
                <ShoppingBag
                  size={35}
                  className="mx-auto mb-3 text-[#d8b8c1]"
                />

                <p className="text-sm text-[#92737c]">
                  No service sales recorded.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-pink-100 text-left">
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                        #
                      </th>

                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                        Service
                      </th>

                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                        Transactions
                      </th>

                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                        Sales
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.salesByService.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={`${item.serviceName}-${index}`}
                          className="border-b border-pink-50 last:border-0"
                        >
                          <td className="py-4 text-sm font-medium text-[#92737c]">
                            {index + 1}
                          </td>

                          <td className="py-4">
                            <p className="font-semibold text-[#5b3e45]">
                              {item.serviceName ||
                                'Unnamed Service'}
                            </p>
                          </td>

                          <td className="py-4 text-right text-sm text-[#92737c]">
                            {Number(
                              item.transactions ||
                                0
                            )}
                          </td>

                          <td className="py-4 text-right text-sm font-bold text-[#5b3e45]">
                            {formatCurrency(
                              Number(
                                item.sales || 0
                              )
                            )}
                          </td>
                        </tr>
                      )
                    )}

                    <tr>
                      <td
                        colSpan={2}
                        className="pt-4 text-sm font-semibold text-[#5b3e45]"
                      >
                        Total
                      </td>

                      <td className="pt-4 text-right text-sm font-bold text-[#5b3e45]">
                        {
                          totalServiceTransactions
                        }
                      </td>

                      <td className="pt-4 text-right text-sm font-bold text-[#c26c84]">
                        {formatCurrency(
                          report.salesByService.reduce(
                            (
                              total,
                              item
                            ) =>
                              total +
                              Number(
                                item.sales ||
                                  0
                              ),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ======================================
              SALES BY EMPLOYEE
          ======================================= */}

          <div className="print-card rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#5b3e45]">
                  Sales by Employee
                </h2>

                <p className="text-sm text-[#92737c]">
                  Employee performance for{' '}
                  {formattedPeriod}
                </p>
              </div>

              <Users
                size={21}
                className="text-[#c26c84]"
              />
            </div>

            {!report?.salesByEmployee
              ?.length ? (
              <div className="py-10 text-center">
                <Users
                  size={35}
                  className="mx-auto mb-3 text-[#d8b8c1]"
                />

                <p className="text-sm text-[#92737c]">
                  No employee sales recorded.
                </p>
              </div>
            ) : (
              <>
              <EmployeePerformanceChart rows={report.salesByEmployee} />
              <details className="group">
                <summary className="mb-4 cursor-pointer text-sm font-semibold text-[#8b5cf6]">View employee data table</summary>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-pink-100 text-left">
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                        #
                      </th>

                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                        Employee
                      </th>

                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                        Transactions
                      </th>

                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                        Sales
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.salesByEmployee.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={`${item.employeeName}-${index}`}
                          className="border-b border-pink-50 last:border-0"
                        >
                          <td className="py-4 text-sm font-medium text-[#92737c]">
                            {index + 1}
                          </td>

                          <td className="py-4">
                            <p className="font-semibold text-[#5b3e45]">
                              {item.employeeName ||
                                'Not recorded'}
                            </p>
                          </td>

                          <td className="py-4 text-right text-sm text-[#92737c]">
                            {Number(
                              item.transactions ||
                                0
                            )}
                          </td>

                          <td className="py-4 text-right text-sm font-bold text-[#5b3e45]">
                            {formatCurrency(
                              Number(
                                item.sales || 0
                              )
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              </details>
              </>
            )}
          </div>
        </>
      )}

      </div>

    </>
  );
};

export default SalesReportPage;
