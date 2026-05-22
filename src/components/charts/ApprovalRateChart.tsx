import { motion } from 'framer-motion';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber, getCityColor } from '@/lib/utils';

export default function ApprovalRateChart() {
  const properties = useFilteredProperties();
  const { approvalRates } = useAnalytics(properties);

  // Sort by highest approval rate
  const sortedRates = [...approvalRates].sort((a, b) => b.rate - a.rate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="card p-5 flex flex-col h-[400px]"
    >
      <div>
        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Application Approval Rates</h3>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Percentage of properties approved by municipality municipal bodies
        </p>
      </div>

      <div className="flex-1 mt-4 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
        {sortedRates.map((item, index) => {
          const barColor = getCityColor(item.city);
          return (
            <div key={item.city} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--color-text-secondary)]">{item.city}</span>
                <span className="text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <span className="text-emerald-500">{item.rate.toFixed(1)}%</span>
                  <span className="text-[var(--color-text-tertiary)] font-normal">
                    ({formatNumber(item.approved)}/{formatNumber(item.total)})
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden border border-[var(--color-border)]/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.rate}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.05 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${barColor}aa, ${barColor})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
