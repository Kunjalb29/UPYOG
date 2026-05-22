import { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Menu, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useThemeStore } from '@/store/useThemeStore';
import { useUIStore } from '@/store/useUIStore';
import { usePropertyStore } from '@/store/usePropertyStore';
import { cn } from '@/lib/utils';

export default function TopBar() {
  const { theme, toggleTheme } = useThemeStore();
  const { setSidebarOpen, notifications, markNotificationRead } = useUIStore();
  const { selectedCity, setSelectedCity } = usePropertyStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchFocused, setSearchFocused] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b glass"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className={cn(
          'relative flex items-center transition-all duration-300',
          searchFocused ? 'w-80' : 'w-64'
        )}>
          <Search className="absolute left-3 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search properties... (⌘K)"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-10 pl-10 pr-4 rounded-xl text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50"
            style={{
              backgroundColor: 'var(--color-surface-tertiary)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
          <Clock className="w-3.5 h-3.5" />
          {format(currentTime, 'hh:mm:ss a')}
        </div>

        {/* City Filter */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="hidden sm:block h-9 px-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          <option value="All Cities">All Cities</option>
          {['Delhi', 'Mumbai', 'Pune', 'Bengaluru', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <Sun className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Moon className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unread}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 rounded-2xl border overflow-hidden"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  boxShadow: 'var(--shadow-dropdown)',
                }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-center" style={{ color: 'var(--color-text-tertiary)' }}>No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={cn(
                          'px-4 py-3 border-b cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors',
                          !n.read && 'bg-indigo-500/[0.03]'
                        )}
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{n.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer shadow-lg shadow-indigo-500/20">
          U
        </div>
      </div>
    </header>
  );
}
