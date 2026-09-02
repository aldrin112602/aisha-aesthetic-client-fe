export interface WalkinRecord {
  id: number;
  name: string;
  phoneNumber: string | null;
  serviceName: string;
  category: string;
  area: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface WalkinPayload {
  name: string;
  phoneNumber: string | null;
  serviceName: string;
  category: string;
  area: string;
  price: number;
  notes?: string;
  employeeId: number | null;
}
