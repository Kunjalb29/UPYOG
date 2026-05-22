export interface Property {
  property_id: string;
  tenant: string;
  owner_name: string;
  property_type: PropertyType;
  ward: string;
  area_sqft: number;
  status: PropertyStatus;
  annual_tax_inr: number;
  collection_inr: number;
  registration_date: string;
  floor_count: number;
  address: string;
}

export type PropertyStatus = 'Approved' | 'Pending' | 'Rejected';
export type PropertyType = 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural' | 'Mixed Use';

export interface CityStats {
  city: string;
  totalProperties: number;
  approved: number;
  pending: number;
  rejected: number;
  totalTax: number;
  totalCollection: number;
  collectionRate: number;
  avgArea: number;
  propertyTypes: Record<string, number>;
  wardStats: Record<string, WardStats>;
}

export interface WardStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  collection: number;
  tax: number;
}

export interface KPIData {
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: string;
  format: 'number' | 'currency' | 'percentage';
  color: string;
  sparklineData?: number[];
}

export interface FilterState {
  city: string;
  status: string;
  propertyType: string;
  dateRange: [string, string] | null;
  areaRange: [number, number] | null;
  searchQuery: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  count: number;
  collection: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}
