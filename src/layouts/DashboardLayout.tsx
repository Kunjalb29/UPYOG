import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '@/components/navigation/Sidebar';
import TopBar from '@/components/navigation/TopBar';
import MobileNav from '@/components/navigation/MobileNav';
import PropertyModal from '@/components/dashboard/PropertyModal';
import { useUIStore } from '@/store/useUIStore';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
      {/* Global Property Details Modal */}
      <PropertyModal />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content Area */}
      <motion.div
        initial={false}
        animate={{ paddingLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen hidden lg:block"
      >
        <TopBar />
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>

      {/* Mobile/Tablet Layout (no sidebar offset) */}
      <div className="lg:hidden min-h-screen">
        <TopBar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
