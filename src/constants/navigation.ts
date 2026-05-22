import {
  LayoutDashboard, BarChart3, Building2, BrainCircuit,
  FileText, Settings,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'City Insights', path: '/cities', icon: Building2 },
  { label: 'AI Assistant', path: '/ai', icon: BrainCircuit, badge: 'AI' },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const SUGGESTED_PROMPTS = [
  'Which city has the highest collection?',
  'Compare Pune and Jaipur property data',
  'What is the approval rate in Delhi?',
  'Show insights about Mumbai properties',
  'Which wards generate the highest revenue?',
  'What are the monthly registration trends?',
  'Which city has the most pending approvals?',
  'Summarize the overall property tax analytics',
];
