import { motion } from 'framer-motion';
import CollectionByCity from '@/components/charts/CollectionByCity';
import ApprovalRejectionChart from '@/components/charts/ApprovalRejectionChart';
import PendingPropertiesChart from '@/components/charts/PendingPropertiesChart';
import PropertyTypeDistribution from '@/components/charts/PropertyTypeDistribution';
import WardAnalysis from '@/components/charts/WardAnalysis';
import MonthlyTrends from '@/components/charts/MonthlyTrends';
import RevenueHeatmap from '@/components/charts/RevenueHeatmap';
import ApprovalRateChart from '@/components/charts/ApprovalRateChart';

export default function AnalyticsPage() {
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
            Advanced Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            Granular analysis of property tax collections, registrations, and municipal approval lifecycles
          </p>
        </div>
      </motion.div>

      {/* Grid of All 8 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollectionByCity />
        <ApprovalRejectionChart />
        <PendingPropertiesChart />
        <PropertyTypeDistribution />
        <WardAnalysis />
        <MonthlyTrends />
        <RevenueHeatmap />
        <ApprovalRateChart />
      </div>
    </div>
  );
}
