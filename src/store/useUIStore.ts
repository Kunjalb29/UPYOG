import { create } from 'zustand';
import type { NotificationItem } from '@/types/property';
import { generateId } from '@/lib/utils';

interface UIStore {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notifications: NotificationItem[];
  propertyModalId: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setPropertyModalId: (id: string | null) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarCollapsed: false,
  sidebarOpen: false,
  commandPaletteOpen: false,
  propertyModalId: null,
  notifications: [
    {
      id: '1',
      title: 'System Update',
      message: 'UPYOG Analytics Dashboard v2.0 is now live with AI-powered insights.',
      type: 'info',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      title: 'Data Synced',
      message: 'All 1,000 property records have been successfully loaded.',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '3',
      title: 'Pending Reviews',
      message: 'There are properties across multiple cities pending approval review.',
      type: 'warning',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
  ],

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setPropertyModalId: (id) => set({ propertyModalId: id }),

  addNotification: (notification) =>
    set((s) => ({
      notifications: [
        { ...notification, id: generateId(), timestamp: new Date(), read: false },
        ...s.notifications,
      ],
    })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
