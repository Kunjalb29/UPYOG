import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/lib/utils';

const COLORS = {
  Approved: '#22c55e',
  Pending: '#f59e0b',
  Rejected: '#ef4444',
};

export default function StatusPieChart() {
  const properties = usePropertyStore((s) => s.getFilteredProperties());
  const { totalStats } = useAnalytics(properties);

  const data = [
    { name: 'Approved', value: totalStats.approved, color: COLORS.Approved },
    { name: 'Pending', value: totalStats.pending, color: COLORS.Pending },
    { name: 'Rejected', value: totalStats.rejected, color: COLORS.Rejected },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Status Distribution
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
          Property approval breakdown
        </p>
      </div>

      <div className="h-56 flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [formatNumber(value), name]}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-dropdown)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {d.name} ({formatNumber(d.value)})
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
