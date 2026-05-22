import { useMemo } from 'react';
import KPICard from './KPICard';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { KPIData } from '@/types/property';
import { CITIES } from '@/constants/cities';

export default function KPIGrid() {
  const properties = useFilteredProperties();
  const { totalStats, cityStats } = useAnalytics(properties);

  const kpis = useMemo<KPIData[]>(() => {
    // Generate sparkline data from city-level breakdowns
    const sparkProps = CITIES.map((c) => cityStats.find((cs) => cs.city === c)?.totalProperties || 0);
    const sparkApproved = CITIES.map((c) => cityStats.find((cs) => cs.city === c)?.approved || 0);
    const sparkRejected = CITIES.map((c) => cityStats.find((cs) => cs.city === c)?.rejected || 0);
    const sparkCollection = CITIES.map((c) => cityStats.find((cs) => cs.city === c)?.totalCollection || 0);

    return [
      {
        label: 'Total Properties',
        value: totalStats.total,
        change: 12.5,
        changeType: 'increase',
        icon: 'Building2',
        format: 'number',
        color: '#6366f1',
        sparklineData: sparkProps,
      },
      {
        label: 'Approved Properties',
        value: totalStats.approved,
        change: 8.3,
        changeType: 'increase',
        icon: 'CheckCircle2',
        format: 'number',
        color: '#22c55e',
        sparklineData: sparkApproved,
      },
      {
        label: 'Rejected Properties',
        value: totalStats.rejected,
        change: 2.1,
        changeType: 'decrease',
        icon: 'XCircle',
        format: 'number',
        color: '#f43f5e',
        sparklineData: sparkRejected,
      },
      {
        label: 'Total Collection',
        value: totalStats.totalCollection,
        change: 15.7,
        changeType: 'increase',
        icon: 'IndianRupee',
        format: 'currency',
        color: '#8b5cf6',
        sparklineData: sparkCollection,
      },
    ];
  }, [totalStats, cityStats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <KPICard key={kpi.label} data={kpi} index={i} />
      ))}
    </div>
  );
}
