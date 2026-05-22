import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatCompactINR } from '@/lib/utils';
import { CITY_COLORS } from '@/constants/cities';

export default function CityOverviewChart() {
  const properties = usePropertyStore((s) => s.getFilteredProperties());
  const { cityStats } = useAnalytics(properties);

  const data = cityStats
    .map((cs) => ({
      city: cs.city,
      collection: cs.totalCollection,
      fill: CITY_COLORS[cs.city] || '#6366f1',
    }))
    .sort((a, b) => b.collection - a.collection);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Collection by City
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Total tax collection across municipalities
          </p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="city"
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCompactINR(v)}
            />
            <Tooltip
              formatter={(value: any) => [formatCompactINR(Number(value)), 'Collection']}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-dropdown)',
              }}
            />
            <Bar dataKey="collection" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
