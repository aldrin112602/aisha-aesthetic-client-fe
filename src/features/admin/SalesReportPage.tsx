import SalesBreakdown from './components/SalesBreakdown';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  CalendarDays,
  Filter,
  FileDown,
  RefreshCw,
  RotateCcw,
  FileSpreadsheet,
} from 'lucide-react';

import Swal from 'sweetalert2';
import { Alert, LinearProgress } from '@mui/material';

import writeExcelFile, { type SheetData } from 'write-excel-file/browser';

import {
  getSalesReport,
  getEmployeeOptions,
  getServiceOptions,
  type SalesReport,
  type EmployeeOption,
  type ServiceOption,
} from '../../api/salesReport.api';

import SalesOverview from './components/SalesOverview';

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
      (filterMode === 'range' && (!startDate || !endDate || startDate > endDate)) ||
      (filterMode === 'month' && !selectedMonth)
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
    // Loading state tracks the asynchronous request started by a filter change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  // EMPTY REPORT SAFETY
  // ==========================================

  const summary =
    report?.summary;

  const bookings =
    report?.bookings;

  // ==========================================
  // EXPORT TO EXCEL
  // ==========================================

  const handleExportExcel = async () => {
    if (!report || loading || loadedFilterKey !== filterKey) {
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
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Excel Export Failed',
        text:
          error instanceof Error
            ? error.message
            : 'Unable to export the Excel report. Please try again.',
        confirmButtonColor: '#c26c84',
      });
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
      <div className="min-w-0 bg-[#fff8fa] p-4 md:p-6 lg:p-8">

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
            disabled={!report || loading || loadedFilterKey !== filterKey}
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

      {loading && <LinearProgress aria-label="Updating sales report" sx={{ mb: 2, borderRadius: 2, bgcolor: '#f7e6ec', '& .MuiLinearProgress-bar': { bgcolor: '#bd657e' } }} />}

      {loading && !report ? (
        <div className="flex min-h-100 items-center justify-center rounded-2xl border border-pink-100 bg-white shadow-sm">
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
      ) : !report || loadedFilterKey !== filterKey ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          {filterMode === 'range' && (!startDate || !endDate) ? 'Choose a start and end date to view your report.'
            : filterMode === 'range' && startDate > endDate ? 'The end date must be on or after the start date.'
              : filterMode === 'month' && !selectedMonth ? 'Choose a month to view your report.'
                : loading ? 'Updating charts for your selected filters…' : 'No report is available for these filters. Use Refresh to try again.'}
        </Alert>
      ) : (
        <>
          {report && <SalesOverview report={report} />}

          <SalesBreakdown kind="service" period={formattedPeriod} rows={report.salesByService.map(row => ({ ...row, name: row.serviceName || 'Unnamed Service' }))} />
          <SalesBreakdown kind="employee" period={formattedPeriod} rows={report.salesByEmployee.map(row => ({ ...row, name: row.employeeName || 'Not recorded' }))} />
        </>
      )}

      </div>

    </>
  );
};

export default SalesReportPage;
