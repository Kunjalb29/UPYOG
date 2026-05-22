import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatCompactINR } from '@/lib/utils';
import { CITY_COLORS } from '@/constants/cities';

export default function CollectionByCity() {
  const properties = useFilteredProperties();
  const { cityStats } = useAnalytics(properties);

  // Sort cities by total collection descending
  const sortedStats = [...cityStats].sort((a, b) => b.totalCollection - a.totalCollection);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl shadow-lg">
          <p className="font-semibold text-sm text-[var(--color-text-primary)]">{data.city}</p>
          <div className="mt-1 space-y-1">
            <p className="text-xs text-[var(--color-text-secondary)]">
              Collection: <span className="font-medium text-[var(--color-text-primary)]">{formatCompactINR(data.totalCollection)}</span>
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Tax Demanded: <span className="font-medium text-[var(--color-text-primary)]">{formatCompactINR(data.totalTax)}</span>
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Collection Rate: <span className="font-medium text-emerald-500">{data.collectionRate.toFixed(1)}%</span>
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
      transition={{ duration: 0.4 }}
      className="card p-5 flex flex-col h-[400px]"
    >
      <div>
        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Revenue Collection by City</h3>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Total property tax collection sorted by highest performance
        </p>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedStats}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="city"
              stroke="var(--color-text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--color-text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatCompactINR(val)}
            />
            <Tooltip content={customTooltip} cursor={{ fill: 'var(--color-surface-tertiary)', opacity: 0.3 }} />
            <Bar
              dataKey="totalCollection"
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
            >
              {sortedStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CITY_COLORS[entry.city] || 'var(--color-primary-500)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
