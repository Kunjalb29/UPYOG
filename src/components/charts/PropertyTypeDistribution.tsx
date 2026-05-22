import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/lib/utils';
import { PROPERTY_TYPE_COLORS } from '@/constants/cities';

export default function PropertyTypeDistribution() {
  const properties = usePropertyStore((s) => s.getFilteredProperties());
  const { propertyTypeDistribution } = useAnalytics(properties);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = propertyTypeDistribution.reduce((acc, curr) => acc + curr.value, 0);
      const percentage = total > 0 ? (data.value / total) * 100 : 0;

      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl shadow-lg">
          <p className="font-semibold text-sm text-[var(--color-text-primary)]">{data.name}</p>
          <div className="mt-1 space-y-1 text-xs">
            <p className="text-[var(--color-text-secondary)]">
              Count: <span className="font-medium text-[var(--color-text-primary)]">{formatNumber(data.value)}</span>
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Share: <span className="font-semibold text-[var(--color-primary-500)]">{percentage.toFixed(1)}%</span>
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
      transition={{ duration: 0.4, delay: 0.3 }}
      className="card p-5 flex flex-col h-[400px]"
    >
      <div>
        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Property Type Distribution</h3>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Proportional breakdown of registered property classes
        </p>
      </div>

      <div className="flex-1 min-h-0 mt-4 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={propertyTypeDistribution}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {propertyTypeDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PROPERTY_TYPE_COLORS[entry.name] || 'var(--color-primary-500)'}
                />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
