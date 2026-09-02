export type AppointmentStatus =
  | 'Pending'
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface Appointment {
  id: number;
  customerId: number;
  employeeId?: number | null;
  serviceId?: number;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  area: string;
  price: number;
  status: AppointmentStatus | string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerShopArea?: string | null;
  employeeName?: string | null;
  employeeEmail?: string | null;
  employeeShopArea?: string | null;
  notes?: string | null;
  createdAt?: string;
}

export type AppointmentStatusUpdate = Pick<Appointment, 'status'>;

export interface BookingPayload {
  customerId: number;
  serviceId: number;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  area: string;
  price: number;
}
