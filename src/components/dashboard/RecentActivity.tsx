import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function RecentActivity() {
  const properties = useFilteredProperties();

  const recent = [...properties]
    .sort((a, b) => new Date(b.registration_date).getTime() - new Date(a.registration_date).getTime())
    .slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Recent Registrations
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Latest property registrations
          </p>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
          View all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {recent.map((p, i) => {
          const statusStyle = getStatusColor(p.status);
          return (
            <motion.div
              key={p.property_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {p.owner_name}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                  {p.tenant} • {p.ward} • {p.property_type}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${statusStyle.bg} ${statusStyle.text}`}>
                  {p.status}
                </span>
                <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                  {formatDate(p.registration_date)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
