import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { usePropertyStore } from '@/store/usePropertyStore';
import { getStatusColor, formatINR, formatNumber, formatDate } from '@/lib/utils';
import { X, Building, User, MapPin, Calendar, Layers, Activity, Check, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PropertyModal() {
  const { propertyModalId, setPropertyModalId } = useUIStore();
  const { properties, updatePropertyStatus } = usePropertyStore();

  const property = properties.find((p) => p.property_id === propertyModalId);

  if (!property) return null;

  const statusClasses = getStatusColor(property.status);
  const collectionRate = property.annual_tax_inr > 0 
    ? (property.collection_inr / property.annual_tax_inr) * 100 
    : 0;

  const handleApprove = () => {
    updatePropertyStatus(property.property_id, 'Approved');
    toast.success(`Property ${property.property_id} approved successfully!`);
  };

  const handleReject = () => {
    updatePropertyStatus(property.property_id, 'Rejected');
    toast.error(`Property ${property.property_id} has been rejected.`);
  };

  return (
    <AnimatePresence>
      {propertyModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPropertyModalId(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal content box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header row */}
            <div className="p-6 border-b border-[var(--color-border)] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusClasses.bg} ${statusClasses.text} ${statusClasses.border} flex items-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusClasses.dot}`} />
                    {property.status}
                  </span>
                  <h2 className="font-mono text-xs text-[var(--color-text-tertiary)]">
                    ID: {property.property_id}
                  </h2>
                </div>
                <h3 className="font-bold text-lg text-[var(--color-text-primary)] mt-1.5">
                  {property.address}
                </h3>
              </div>
              <button
                onClick={() => setPropertyModalId(null)}
                className="p-1.5 rounded-xl hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer border border-transparent hover:border-[var(--color-border)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details panel */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Structural Specs */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[10px] uppercase text-[var(--color-text-tertiary)] tracking-wider">
                    Structural Profile
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)]">Property Type</p>
                        <p className="font-semibold text-[var(--color-text-primary)]">{property.property_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)]">Size & Elevation</p>
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {formatNumber(property.area_sqft)} sqft | {property.floor_count} Floor{property.floor_count > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)]">Registration Date</p>
                        <p className="font-semibold text-[var(--color-text-primary)]">{formatDate(property.registration_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Ownership Specs */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[10px] uppercase text-[var(--color-text-tertiary)] tracking-wider">
                    Ownership & Admin
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)]">Registered Owner</p>
                        <p className="font-semibold text-[var(--color-text-primary)]">{property.owner_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--color-text-tertiary)]">Administrative Division</p>
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {property.tenant} | {property.ward}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Performance Panel */}
              <div className="border-t border-[var(--color-border)]/60 pt-6 space-y-4">
                <h4 className="font-bold text-[10px] uppercase text-[var(--color-text-tertiary)] tracking-wider">
                  Financial Audit Specs
                </h4>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)] p-4 rounded-xl">
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">Annual Tax Demand</p>
                    <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1">
                      {formatINR(property.annual_tax_inr)}
                    </p>
                  </div>

                  <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)] p-4 rounded-xl">
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">Revenue Collected</p>
                    <p className="text-sm font-bold text-emerald-500 mt-1">
                      {formatINR(property.collection_inr)}
                    </p>
                  </div>

                  <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)] p-4 rounded-xl">
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">Compliance Index</p>
                    <p className="text-sm font-bold text-indigo-500 mt-1">
                      {collectionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons row */}
            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)] flex justify-between gap-3 shrink-0">
              <button
                onClick={() => setPropertyModalId(null)}
                className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-secondary)] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Close Profile
              </button>

              {/* Action Buttons for Validation backlog */}
              {property.status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <Ban className="w-4 h-4" />
                    Reject Application
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4" />
                    Validate & Approve
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
