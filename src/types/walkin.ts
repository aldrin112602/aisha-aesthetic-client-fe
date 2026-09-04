export interface WalkinRecord {
  id: number;
  customerId: number | null;
  customerName: string | null;
  phoneNumber: string | null;
  employeeId: number | null;
  employeeName: string | null;
  serviceId: number | null;
  serviceName: string | null;
  category: string | null;
  date: string | null;
  time: string | null;
  area: string | null;
  price: number | null;
  appointmentType: "walkin";
  status: string | null;
  notes: string | null;
  createdAt: string | null;
}

export interface WalkinPayload {
  name: string;
  phoneNumber: string | null;
  serviceId?: number | null;
  serviceName: string;
  category: string;
  area: string;
  price: number;
  notes?: string;
  employeeId: number | null;
}

export interface RecentWalkinsProps {
  walkins: WalkinRecord[];
}