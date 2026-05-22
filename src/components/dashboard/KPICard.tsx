import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { formatINR, formatNumber, formatPercentage, cn } from '@/lib/utils';
import type { KPIData } from '@/types/property';
import * as LucideIcons from 'lucide-react';

interface KPICardProps {
  data: KPIData;
  index: number;
}

export default function KPICard({ data, index }: KPICardProps) {
  const animatedValue = useAnimatedCounter(data.value, 1800);

  const formatValue = (val: number) => {
    switch (data.format) {
      case 'currency': return formatINR(val);
      case 'percentage': return formatPercentage(val);
      default: return formatNumber(val);
    }
  };

  const TrendIcon = data.changeType === 'increase' ? TrendingUp : data.changeType === 'decrease' ? TrendingDown : Minus;
  const trendColor = data.changeType === 'increase' ? 'text-emerald-500' : data.changeType === 'decrease' ? 'text-rose-500' : 'text-slate-400';
  const trendBg = data.changeType === 'increase' ? 'bg-emerald-500/10' : data.changeType === 'decrease' ? 'bg-rose-500/10' : 'bg-slate-500/10';

  // Dynamically resolve icon
  const IconComponent = (LucideIcons as any)[data.icon] || LucideIcons.Activity;

  const sparkData = data.sparklineData?.map((v, i) => ({ idx: i, val: v })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="card p-5 relative overflow-hidden group cursor-pointer"
    >
      {/* Gradient accent at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-80"
        style={{ background: `linear-gradient(90deg, ${data.color}, ${data.color}88)` }}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
            {data.label}
          </p>
          <p className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {formatValue(animatedValue)}
          </p>

          {/* Trend */}
          {data.change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={cn('flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md', trendBg, trendColor)}>
                <TrendIcon className="w-3 h-3" />
                {Math.abs(data.change).toFixed(1)}%
              </span>
              <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>vs last period</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${data.color}15`,
            color: data.color,
          }}
        >
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      {/* Sparkline */}
      {sparkData.length > 0 && (
        <div className="mt-3 h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={data.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={data.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="val"
                stroke={data.color}
                strokeWidth={1.5}
                fill={`url(#spark-${index})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
