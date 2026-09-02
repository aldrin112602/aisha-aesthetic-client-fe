export type FollowupStatus = 'scheduled' | 'completed' | 'cancelled' | string;

export interface Followup {
  id: number;
  customerId: number;
  serviceId: number | null;
  date: string;
  notes: string | null;
  status: FollowupStatus;
}

export interface FollowupPayload {
  customerId: number;
  date: string;
  notes?: string;
}
