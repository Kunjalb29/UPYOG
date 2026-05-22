import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatCompactINR, formatNumber, formatPercentage } from '@/lib/utils';
import { CITIES, CITY_COLORS } from '@/constants/cities';
import { Building2, CheckCircle2, AlertCircle, IndianRupee, ArrowRightLeft, Landmark } from 'lucide-react';

export default function CityInsightsPage() {
  const properties = useFilteredProperties();
  const { cityStats } = useAnalytics(properties);
  const [activeTab, setActiveTab] = useState<'profiles' | 'compare'>('profiles');
  const [selectedCity, setSelectedCity] = useState<string>('Delhi');

  // Comparison State
  const [compareCityA, setCompareCityA] = useState<string>('Delhi');
  const [compareCityB, setCompareCityB] = useState<string>('Mumbai');

  const activeCityStats = cityStats.find((cs) => cs.city === selectedCity) || cityStats[0];

  // Prepare Radar Chart Data for comparison
  const radarData = (() => {
    const statsA = cityStats.find((cs) => cs.city === compareCityA);
    const statsB = cityStats.find((cs) => cs.city === compareCityB);

    if (!statsA || !statsB) return [];

    // Find max values to normalize
    const maxProps = Math.max(...cityStats.map(c => c.totalProperties), 1);
    const maxCollection = Math.max(...cityStats.map(c => c.totalCollection), 1);

    return [
      {
        subject: 'Property Count',
        [compareCityA]: (statsA.totalProperties / maxProps) * 100,
        [compareCityB]: (statsB.totalProperties / maxProps) * 100,
        rawA: formatNumber(statsA.totalProperties),
        rawB: formatNumber(statsB.totalProperties),
      },
      {
        subject: 'Tax Collected',
        [compareCityA]: (statsA.totalCollection / maxCollection) * 100,
        [compareCityB]: (statsB.totalCollection / maxCollection) * 100,
        rawA: formatCompactINR(statsA.totalCollection),
        rawB: formatCompactINR(statsB.totalCollection),
      },
      {
        subject: 'Collection %',
        [compareCityA]: statsA.collectionRate,
        [compareCityB]: statsB.collectionRate,
        rawA: formatPercentage(statsA.collectionRate),
        rawB: formatPercentage(statsB.collectionRate),
      },
      {
        subject: 'Approval %',
        [compareCityA]: statsA.totalProperties > 0 ? (statsA.approved / statsA.totalProperties) * 100 : 0,
        [compareCityB]: statsB.totalProperties > 0 ? (statsB.approved / statsB.totalProperties) * 100 : 0,
        rawA: formatPercentage(statsA.totalProperties > 0 ? (statsA.approved / statsA.totalProperties) * 100 : 0),
        rawB: formatPercentage(statsB.totalProperties > 0 ? (statsB.approved / statsB.totalProperties) * 100 : 0),
      },
      {
        subject: 'Backlog Ratio',
        [compareCityA]: statsA.totalProperties > 0 ? (statsA.pending / statsA.totalProperties) * 100 : 0,
        [compareCityB]: statsB.totalProperties > 0 ? (statsB.pending / statsB.totalProperties) * 100 : 0,
        rawA: formatPercentage(statsA.totalProperties > 0 ? (statsA.pending / statsA.totalProperties) * 100 : 0),
        rawB: formatPercentage(statsB.totalProperties > 0 ? (statsB.pending / statsB.totalProperties) * 100 : 0),
      },
    ];
  })();

  return (
    <div className="space-y-6">
      {/* Page Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            City Insights & Benchmarking
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            Explore individual municipality performance indexes and perform side-by-side comparative analysis
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex bg-[var(--color-surface-tertiary)] p-1 rounded-xl border border-[var(--color-border)]/5 w-fit">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'profiles'
                ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text-primary)] border border-[var(--color-border)]/10'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            Municipality Profiles
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'compare'
                ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text-primary)] border border-[var(--color-border)]/10'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Benchmarking Mode
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profiles' ? (
          <motion.div
            key="profiles"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Grid of City Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {cityStats.map((cs) => {
                const accentColor = CITY_COLORS[cs.city] || 'var(--color-primary-500)';
                const isSelected = selectedCity === cs.city;
                const appRate = cs.totalProperties > 0 ? (cs.approved / cs.totalProperties) * 100 : 0;

                return (
                  <button
                    key={cs.city}
                    onClick={() => setSelectedCity(cs.city)}
                    className={`card p-4 text-left transition-all relative overflow-hidden flex flex-col justify-between h-28 border cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-text-primary)] ring-1 ring-[var(--color-text-primary)]/10 bg-[var(--color-surface-tertiary)]'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    {/* Visual Accent */}
                    <div
                      className="absolute top-0 left-0 w-full h-[3px]"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div>
                      <p className="font-bold text-sm text-[var(--color-text-primary)]">{cs.city}</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                        {formatNumber(cs.totalProperties)} Properties
                      </p>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between w-full">
                      <p className="text-xs font-bold text-emerald-500">
                        {formatCompactINR(cs.totalCollection)}
                      </p>
                      <p className="text-[10px] font-semibold text-[var(--color-text-secondary)]">
                        {appRate.toFixed(0)}% Aprv
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected City Details Section */}
            {activeCityStats && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* City Stats Summary Card */}
                <div className="card p-6 flex flex-col justify-between h-fit lg:sticky lg:top-24">
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: CITY_COLORS[activeCityStats.city] }}
                      />
                      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                        {activeCityStats.city} Municipality
                      </h2>
                    </div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1.5">
                      Overview of structural properties, revenue collection, and application approvals
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase font-semibold tracking-wider">
                          Properties Registered
                        </p>
                        <p className="text-base font-bold text-[var(--color-text-primary)]">
                          {formatNumber(activeCityStats.totalProperties)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase font-semibold tracking-wider">
                          Tax Revenue Collected
                        </p>
                        <p className="text-base font-bold text-emerald-500">
                          {formatCompactINR(activeCityStats.totalCollection)}{' '}
                          <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">
                            / {formatCompactINR(activeCityStats.totalTax)} demand
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase font-semibold tracking-wider">
                          Approval Index
                        </p>
                        <p className="text-base font-bold text-teal-500">
                          {((activeCityStats.approved / activeCityStats.totalProperties) * 100).toFixed(1)}%{' '}
                          <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">
                            ({formatNumber(activeCityStats.approved)} approved)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase font-semibold tracking-wider">
                          Validation Backlog
                        </p>
                        <p className="text-base font-bold text-amber-500">
                          {formatNumber(activeCityStats.pending)}{' '}
                          <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">
                            properties pending review
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-panels for detailed statistics */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Property type breakdown panel */}
                  <div className="card p-6">
                    <h3 className="font-bold text-base text-[var(--color-text-primary)]">Property Distribution</h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                      Classification profile inside {activeCityStats.city}
                    </p>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(activeCityStats.propertyTypes).map(([type, count]) => {
                        const pct = activeCityStats.totalProperties > 0 ? (count / activeCityStats.totalProperties) * 100 : 0;
                        return (
                          <div key={type} className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)]/5 p-4 rounded-xl">
                            <p className="text-[11px] text-[var(--color-text-tertiary)] truncate">{type}</p>
                            <div className="flex items-baseline justify-between mt-1">
                              <p className="text-lg font-bold text-[var(--color-text-primary)]">{count}</p>
                              <p className="text-xs font-semibold text-[var(--color-primary-500)]">{pct.toFixed(0)}%</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ward-wise collection summary panel */}
                  <div className="card p-6">
                    <h3 className="font-bold text-base text-[var(--color-text-primary)]">Ward-Wise Financial Index</h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                      Administrative ward contributions and collection rates
                    </p>

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--color-border)] pb-2 text-[var(--color-text-tertiary)] font-semibold">
                            <th className="py-2.5">Ward Name</th>
                            <th>Collection</th>
                            <th>Demand</th>
                            <th>Properties</th>
                            <th className="text-right">Collection Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(activeCityStats.wardStats).map(([ward, stats]) => {
                            const rate = stats.tax > 0 ? (stats.collection / stats.tax) * 100 : 0;
                            return (
                              <tr key={ward} className="border-b border-[var(--color-border)]/40 hover:bg-[var(--color-surface-secondary)] transition-colors">
                                <td className="py-3 font-semibold text-[var(--color-text-secondary)]">{ward}</td>
                                <td className="font-semibold text-emerald-500">{formatCompactINR(stats.collection)}</td>
                                <td className="text-[var(--color-text-secondary)]">{formatCompactINR(stats.tax)}</td>
                                <td className="text-[var(--color-text-secondary)]">{stats.total}</td>
                                <td className="text-right font-bold text-indigo-500">{rate.toFixed(1)}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Selection Column */}
            <div className="card p-6 space-y-6 h-fit lg:sticky lg:top-24">
              <div>
                <h3 className="font-bold text-base text-[var(--color-text-primary)]">Benchmarking Select</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                  Select two cities to compare structural volume, collection efficiencies, and processing backlog
                </p>
              </div>

              {/* City Dropdowns */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] tracking-wider">
                    City A (Primary)
                  </label>
                  <select
                    value={compareCityA}
                    onChange={(e) => setCompareCityA(e.target.value)}
                    className="w-full mt-1.5 bg-[var(--color-surface-tertiary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center text-[var(--color-text-tertiary)]">
                  <ArrowRightLeft className="w-5 h-5 rotate-90 lg:rotate-0" />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] tracking-wider">
                    City B (Benchmark)
                  </label>
                  <select
                    value={compareCityB}
                    onChange={(e) => setCompareCityB(e.target.value)}
                    className="w-full mt-1.5 bg-[var(--color-surface-tertiary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city} disabled={city === compareCityA}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Radar Panel */}
            <div className="card p-6 flex flex-col h-[400px]">
              <div>
                <h3 className="font-bold text-base text-[var(--color-text-primary)]">Benchmark Radar</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                  Visual benchmark mapping on normalized efficiency metrics
                </p>
              </div>

              <div className="flex-1 min-h-0 mt-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="var(--color-border)" opacity={0.6} />
                    <PolarAngleAxis dataKey="subject" stroke="var(--color-text-tertiary)" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name={compareCityA}
                      dataKey={compareCityA}
                      stroke={CITY_COLORS[compareCityA]}
                      fill={CITY_COLORS[compareCityA]}
                      fillOpacity={0.3}
                    />
                    <Radar
                      name={compareCityB}
                      dataKey={compareCityB}
                      stroke={CITY_COLORS[compareCityB]}
                      fill={CITY_COLORS[compareCityB]}
                      fillOpacity={0.3}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparative KPI Metrics */}
            <div className="card p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-[var(--color-text-primary)]">Statistical Benchmarking</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                  Direct key performance metric comparison
                </p>
              </div>

              <div className="mt-4 space-y-4 flex-1 justify-center flex flex-col">
                {radarData.map((d) => (
                  <div key={d.subject} className="space-y-2 border-b border-[var(--color-border)]/40 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-semibold text-[var(--color-text-tertiary)]">{d.subject}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-tertiary)] block font-medium uppercase tracking-wider">{compareCityA}</span>
                        <span className="text-sm font-bold block" style={{ color: CITY_COLORS[compareCityA] }}>
                          {d.rawA}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-tertiary)] block font-medium uppercase tracking-wider">{compareCityB}</span>
                        <span className="text-sm font-bold block" style={{ color: CITY_COLORS[compareCityB] }}>
                          {d.rawB}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
