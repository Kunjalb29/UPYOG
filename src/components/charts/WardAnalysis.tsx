import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/lib/utils';

export default function WardAnalysis() {
  const properties = usePropertyStore((s) => s.getFilteredProperties());
  const { wardAnalysis } = useAnalytics(properties);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl shadow-lg">
          <p className="font-semibold text-sm text-[var(--color-text-primary)]">{data.ward}</p>
          <div className="mt-1 space-y-1 text-xs">
            <p className="text-[var(--color-text-secondary)]">
              Total properties: <span className="font-medium text-[var(--color-text-primary)]">{formatNumber(data.total)}</span>
            </p>
            <p className="text-emerald-500 font-medium">
              Approved: <span>{formatNumber(data.approved)}</span>
            </p>
            <p className="text-amber-500 font-medium">
              Pending: <span>{formatNumber(data.pending)}</span>
            </p>
            <p className="text-rose-500 font-medium">
              Rejected: <span>{formatNumber(data.rejected)}</span>
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
      transition={{ duration: 0.4, delay: 0.4 }}
      className="card p-5 flex flex-col h-[400px]"
    >
      <div>
        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Ward-Wise Property Status</h3>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Stacked status breakdown across administrative wards
        </p>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={wardAnalysis}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="ward"
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
            />
            <Tooltip content={customTooltip} cursor={{ fill: 'var(--color-surface-tertiary)', opacity: 0.3 }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar
              name="Approved"
              dataKey="approved"
              stackId="a"
              fill="#10b981"
              maxBarSize={30}
            />
            <Bar
              name="Pending"
              dataKey="pending"
              stackId="a"
              fill="#f59e0b"
              maxBarSize={30}
            />
            <Bar
              name="Rejected"
              dataKey="rejected"
              stackId="a"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
