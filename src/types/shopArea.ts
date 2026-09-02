export interface ShopArea {
  id: number;
  name: string;
  address?: string;
  contact?: string;
  operatingHours?: string;
  status?: string;
  operatingDays?: string[];
  openingTime?: string;
  closingTime?: string;
}

export type ShopAreaPayload = Omit<ShopArea, 'id'>;
