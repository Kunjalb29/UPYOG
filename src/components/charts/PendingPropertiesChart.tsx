import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/lib/utils';

export default function PendingPropertiesChart() {
  const properties = usePropertyStore((s) => s.getFilteredProperties());
  const { cityStats } = useAnalytics(properties);

  // Sort cities by pending counts descending
  const sortedStats = [...cityStats].sort((a, b) => b.pending - a.pending);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl shadow-lg">
          <p className="font-semibold text-sm text-[var(--color-text-primary)]">{data.city}</p>
          <div className="mt-1 space-y-1 text-xs">
            <p className="text-amber-500 font-medium">
              Pending Validation: <span className="font-semibold">{formatNumber(data.pending)}</span>
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Total Properties: <span>{formatNumber(data.totalProperties)}</span>
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Pending Ratio: <span className="font-medium text-amber-500">{((data.pending / (data.totalProperties || 1)) * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="card p-5 flex flex-col h-[400px]"
    >
      <div>
        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Pending Validations by City</h3>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Backlog of property tax registrations awaiting municipal verification
        </p>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedStats}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} opacity={0.5} />
            <XAxis
              type="number"
              stroke="var(--color-text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="city"
              stroke="var(--color-text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip content={customTooltip} cursor={{ fill: 'var(--color-surface-tertiary)', opacity: 0.3 }} />
            <Bar
              dataKey="pending"
              fill="#f59e0b" // Amber 500
              radius={[0, 4, 4, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
