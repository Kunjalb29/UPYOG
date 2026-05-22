import { motion } from 'framer-motion';
import { Activity, TrendingUp, IndianRupee, Target } from 'lucide-react';
import KPIGrid from '@/components/dashboard/KPIGrid';
import CityOverviewChart from '@/components/dashboard/CityOverviewChart';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatINR, formatPercentage, formatNumber } from '@/lib/utils';

export default function DashboardPage() {
  const properties = usePropertyStore((s) => s.getFilteredProperties());
  const { totalStats } = useAnalytics(properties);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            Overview of property tax analytics across all municipalities
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <KPIGrid />

      {/* Secondary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: 'Pending Review', value: formatNumber(totalStats.pending), icon: Activity, color: '#f59e0b' },
          { label: 'Avg Tax/Property', value: formatINR(totalStats.avgTax), icon: IndianRupee, color: '#8b5cf6' },
          { label: 'Collection Rate', value: formatPercentage(totalStats.collectionRate), icon: TrendingUp, color: '#22c55e' },
          { label: 'Avg Area', value: `${formatNumber(Math.round(totalStats.avgArea))} sqft`, icon: Target, color: '#6366f1' },
        ].map((stat, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{stat.label}</p>
              <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CityOverviewChart />
        </div>
        <StatusPieChart />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
