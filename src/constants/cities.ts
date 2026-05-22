export const CITIES = [
  'Delhi', 'Mumbai', 'Pune', 'Bengaluru', 'Chennai',
  'Hyderabad', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow'
] as const;

export type CityName = typeof CITIES[number];

export const CITY_COLORS: Record<string, string> = {
  Delhi: '#6366f1',
  Mumbai: '#8b5cf6',
  Pune: '#a855f7',
  Bengaluru: '#d946ef',
  Chennai: '#ec4899',
  Hyderabad: '#f43f5e',
  Ahmedabad: '#f97316',
  Kolkata: '#eab308',
  Jaipur: '#22c55e',
  Lucknow: '#14b8a6',
};

export const CITY_GRADIENTS: Record<string, [string, string]> = {
  Delhi: ['#6366f1', '#818cf8'],
  Mumbai: ['#8b5cf6', '#a78bfa'],
  Pune: ['#a855f7', '#c084fc'],
  Bengaluru: ['#d946ef', '#e879f9'],
  Chennai: ['#ec4899', '#f472b6'],
  Hyderabad: ['#f43f5e', '#fb7185'],
  Ahmedabad: ['#f97316', '#fb923c'],
  Kolkata: ['#eab308', '#facc15'],
  Jaipur: ['#22c55e', '#4ade80'],
  Lucknow: ['#14b8a6', '#2dd4bf'],
};

export const PROPERTY_TYPES = [
  'Residential', 'Commercial', 'Industrial', 'Agricultural', 'Mixed Use'
] as const;

export const WARDS = ['Ward A', 'Ward B', 'Ward C', 'Ward D', 'Ward E', 'Ward F'] as const;

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  Pending: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', dot: 'bg-amber-500' },
  Rejected: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', dot: 'bg-rose-500' },
};

export const PROPERTY_TYPE_COLORS: Record<string, string> = {
  Residential: '#6366f1',
  Commercial: '#8b5cf6',
  Industrial: '#f97316',
  Agricultural: '#22c55e',
  'Mixed Use': '#ec4899',
};

export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6',
];
