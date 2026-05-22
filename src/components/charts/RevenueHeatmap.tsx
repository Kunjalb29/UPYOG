import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatCompactINR } from '@/lib/utils';
import { CITIES } from '@/constants/cities';

export default function RevenueHeatmap() {
  const properties = useFilteredProperties();
  const { cityStats } = useAnalytics(properties);
  const [hoveredCell, setHoveredCell] = useState<{
    city: string;
    ward: string;
    collection: number;
    tax: number;
    properties: number;
    x: number;
    y: number;
  } | null>(null);

  // Find max collection across all city-ward combinations to normalize color intensity
  let maxCollection = 1;
  cityStats.forEach((cs) => {
    Object.values(cs.wardStats).forEach((ws) => {
      if (ws.collection > maxCollection) {
        maxCollection = ws.collection;
      }
    });
  });

  const getHeatmapColor = (collection: number) => {
    if (collection === 0) return 'rgba(99, 102, 241, 0.03)'; // transparent indigo-like
    const intensity = collection / maxCollection;
    // Map to a premium indigo/violet scale
    return `rgba(99, 102, 241, ${Math.max(0.15, Math.min(intensity, 1))})`;
  };

  const wards = ['Ward A', 'Ward B', 'Ward C', 'Ward D', 'Ward E', 'Ward F'];

  const handleMouseMove = (e: React.MouseEvent, city: string, ward: string, stats: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + 15;
    const y = e.clientY - rect.top + 15;
    setHoveredCell({
      city,
      ward,
      collection: stats.collection,
      tax: stats.tax,
      properties: stats.total,
      x,
      y,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="card p-5 flex flex-col h-[400px] relative overflow-hidden"
    >
      <div>
        <h3 className="font-bold text-base text-[var(--color-text-primary)]">Revenue Intensity Heatmap</h3>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Ward-wise revenue collection density across all municipalities (indigo intensity represents higher collection)
        </p>
      </div>

      {/* Grid Container */}
      <div className="flex-1 mt-6 flex flex-col overflow-auto min-h-0">
        <div className="min-w-[500px] flex-1 flex flex-col">
          {/* Header Row */}
          <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-semibold text-[var(--color-text-tertiary)]">
            <div className="text-left font-normal">Municipality</div>
            {wards.map((w) => (
              <div key={w}>{w.replace('Ward ', '')}</div>
            ))}
          </div>

          {/* Heatmap Rows */}
          <div className="flex-1 space-y-1.5 min-h-0 overflow-y-auto pr-1">
            {CITIES.map((city) => {
              const cStat = cityStats.find((cs) => cs.city === city);
              return (
                <div key={city} className="grid grid-cols-7 gap-1.5 items-center">
                  <div className="text-xs font-medium truncate text-[var(--color-text-secondary)]">
                    {city}
                  </div>
                  {wards.map((ward) => {
                    const wStats = cStat?.wardStats[ward] || { collection: 0, tax: 0, total: 0 };
                    const cellColor = getHeatmapColor(wStats.collection);
                    return (
                      <div
                        key={ward}
                        className="h-7 rounded-md cursor-pointer transition-transform hover:scale-[1.05] relative border border-[var(--color-border)]/10"
                        style={{ backgroundColor: cellColor }}
                        onMouseEnter={(e) => handleMouseMove(e, city, ward, wStats)}
                        onMouseMove={(e) => handleMouseMove(e, city, ward, wStats)}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Tooltip inside container */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 pointer-events-none bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl shadow-lg text-xs w-48"
            style={{
              left: `${hoveredCell.x}px`,
              top: `${hoveredCell.y}px`,
            }}
          >
            <p className="font-semibold text-[var(--color-text-primary)]">
              {hoveredCell.city} — {hoveredCell.ward}
            </p>
            <div className="mt-1.5 space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-tertiary)]">Collection:</span>
                <span className="font-medium text-emerald-500">{formatCompactINR(hoveredCell.collection)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-tertiary)]">Demand:</span>
                <span className="font-medium text-[var(--color-text-secondary)]">{formatCompactINR(hoveredCell.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-tertiary)]">Properties:</span>
                <span className="font-medium text-[var(--color-text-secondary)]">{hoveredCell.properties}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
