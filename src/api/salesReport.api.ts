import { authFetch } from './client';
// ==========================================
// SALES REPORT API
// ==========================================

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL;

// ==========================================
// TYPES
// ==========================================

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  totalAppointments: number;
  totalWalkins: number;
  averageSale: number;

  appointmentSales: number;
  walkinSales: number;
}

export interface BookingSummary {
  totalBookings: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface DailySale {
  date: string;
  sales: number;
  transactions: number;
}

export interface ServiceSale {
  serviceName: string;
  sales: number;
  transactions: number;
}

export interface EmployeeSale {
  employeeName: string;
  sales: number;
  transactions: number;
}

export interface SalesReport {
  startDate: string;
  endDate: string;

  summary: SalesSummary;

  bookings: BookingSummary;

  dailySales: DailySale[];

  salesByService: ServiceSale[];

  salesByEmployee: EmployeeSale[];
}

export interface SalesReportFilters {
  // 'YYYY-MM' — used when startDate/endDate are not provided
  month?: string;

  // 'YYYY-MM-DD'
  startDate?: string;
  endDate?: string;

  employeeId?: string | number;
  serviceId?: string | number;
  appointmentType?: 'appointment' | 'walkin' | '';
}

export interface EmployeeOption {
  id: number;
  name: string;
}

export interface ServiceOption {
  id: number;
  name: string;
}

// ==========================================
// HANDLE JSON RESPONSE
// ==========================================

const parseJsonResponse = async (
  response: Response,
  fallbackMessage: string
) => {
  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      'The server returned an invalid response.'
    );
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : fallbackMessage;

    throw new Error(message);
  }

  return data;
};

// ==========================================
// GET SALES REPORT
// ==========================================

export const getSalesReport = async (
  filters: SalesReportFilters
): Promise<SalesReport> => {
  const params = new URLSearchParams();

  if (filters.startDate && filters.endDate) {
    params.set('startDate', filters.startDate);
    params.set('endDate', filters.endDate);
  } else if (filters.month) {
    params.set('month', filters.month);
  }

  if (filters.employeeId) {
    params.set('employeeId', String(filters.employeeId));
  }

  if (filters.serviceId) {
    params.set('serviceId', String(filters.serviceId));
  }

  if (filters.appointmentType) {
    params.set('appointmentType', filters.appointmentType);
  }

  const response = await authFetch(
    `${apiBaseUrl}/api/sales-report?${params.toString()}`
  );

  const data = await parseJsonResponse(
    response,
    'Failed to load sales report.'
  );

  return data as SalesReport;
};

// ==========================================
// GET EMPLOYEE OPTIONS (FOR FILTER DROPDOWN)
// ==========================================

export const getEmployeeOptions = async (): Promise<
  EmployeeOption[]
> => {
  const response = await authFetch(
    `${apiBaseUrl}/api/users`
  );

  const data = await parseJsonResponse(
    response,
    'Failed to load employees.'
  );

  return (data as (EmployeeOption & { role: string })[])
    .filter(user => ['employee', 'admin'].includes(String(user.role).trim().toLowerCase()))
    .map(({ id, name }) => ({ id, name }));
};

// ==========================================
// GET SERVICE OPTIONS (FOR FILTER DROPDOWN)
// ==========================================

export const getServiceOptions = async (): Promise<
  ServiceOption[]
> => {
  const response = await authFetch(
    `${apiBaseUrl}/api/services`
  );

  const data = await parseJsonResponse(
    response,
    'Failed to load services.'
  );

  return data as ServiceOption[];
};
