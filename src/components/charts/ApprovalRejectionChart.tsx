import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/lib/utils';

export default function ApprovalRejectionChart() {
  const properties = usePropertyStore((s) => s.getFilteredProperties());
  const { cityStats } = useAnalytics(properties);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = data.totalProperties;
      const approvalRate = total > 0 ? (data.approved / total) * 100 : 0;

      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl shadow-lg">
          <p className="font-semibold text-sm text-[var(--color-text-primary)]">{data.city}</p>
          <div className="mt-1 space-y-1 text-xs">
            <p className="text-[var(--color-text-secondary)]">
              Total Properties: <span className="font-medium text-[var(--color-text-primary)]">{formatNumber(total)}</span>
            </p>
            <p className="text-emerald-500 font-medium">
              Approved: <span>{formatNumber(data.approved)}</span>
            </p>
            <p className="text-rose-500 font-medium">
              Rejected: <span>{formatNumber(data.rejected)}</span>
            </p>
            <p className="text-amber-500 font-medium">
              Pending: <span>{formatNumber(data.pending)}</span>
            </p>
            <div className="border-t border-[var(--color-border)] pt-1 mt-1">
              <p className="text-[var(--color-text-secondary)]">
                Approval Rate: <span className="font-semibold text-emerald-500">{approvalRate.toFixed(1)}%</span>
              </p>
            </div>
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
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card p-5 flex flex-col h-[400px]"
    >
      <div>
        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Approvals vs Rejections</h3>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Comparison of approved and rejected property applications across cities
        </p>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cityStats}
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
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              name="Rejected"
              dataKey="rejected"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
