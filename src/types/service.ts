export type ServiceType = 'Service' | 'Product';
export type ServiceStatus = 'active' | 'inactive';

export interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string | null;
  type?: ServiceType;
  status: ServiceStatus;
}

export type ServicePayload = Omit<Service, 'id'>;
