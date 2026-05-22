import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow, format } from 'date-fns';
import { CITY_COLORS, STATUS_COLORS } from '@/constants/cities';

/** Merge class names with clsx */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format number in Indian currency style: ₹12,34,567.89 */
export function formatINR(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

/** Compact Indian format: ₹12.3L, ₹1.2Cr */
export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
}

/** Format number with Indian comma system */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/** Format as percentage */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Generate random unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Get relative time string from a date */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/** Format date for display */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd MMM yyyy');
}

/** Get status color classes */
export function getStatusColor(status: string) {
  return STATUS_COLORS[status] || STATUS_COLORS.Pending;
}

/** Get city hex color */
export function getCityColor(city: string): string {
  return CITY_COLORS[city] || '#6366f1';
}

/** Delay utility for async operations */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
