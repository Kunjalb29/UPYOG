import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navigation';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-[280px] border-r lg:hidden"
            style={{
              backgroundColor: 'var(--color-sidebar)',
              borderColor: 'var(--color-border)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">UPYOG</span>
                  <p className="text-[10px]" style={{ color: 'var(--color-sidebar-text)' }}>Analytics Platform</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                style={{ color: 'var(--color-sidebar-text)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="px-3 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive ? 'bg-indigo-500/10 text-white' : 'hover:bg-white/5'
                    )
                  }
                  style={({ isActive }) => ({
                    color: isActive ? '#fff' : 'var(--color-sidebar-text)',
                  })}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
