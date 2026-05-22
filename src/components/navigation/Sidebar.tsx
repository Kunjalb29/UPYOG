import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Zap } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navigation';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col border-r"
      style={{
        backgroundColor: 'var(--color-sidebar)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <span className="text-sm font-bold text-white tracking-wide">UPYOG</span>
                <span className="text-[10px] font-medium" style={{ color: 'var(--color-sidebar-text)' }}>
                  Analytics Platform
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-indigo-500/10 text-white'
                  : 'hover:bg-white/5'
              )
            }
            style={({ isActive }) => ({
              color: isActive ? '#fff' : 'var(--color-sidebar-text)',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-indigo-500"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-indigo-400')} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && !sidebarCollapsed && (
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-2 rounded-xl hover:bg-white/5 transition-colors"
          style={{ color: 'var(--color-sidebar-text)' }}
        >
          <motion.div animate={{ rotate: sidebarCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
