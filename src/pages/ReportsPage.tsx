import { motion } from 'framer-motion';
import { useFilteredProperties } from '@/hooks/useFilteredProperties';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatINR, formatNumber, formatPercentage } from '@/lib/utils';
import { FileText, Database, ShieldAlert, BadgeDollarSign, Download, Table, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const properties = useFilteredProperties();
  const { totalStats } = useAnalytics(properties);

  // CSV Export helper
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No records available to export.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            const value = row[fieldName];
            if (value === null || value === undefined) return '';
            const valueStr = String(value);
            // Escape quotes and commas
            if (valueStr.includes(',') || valueStr.includes('"') || valueStr.includes('\n')) {
              return `"${valueStr.replace(/"/g, '""')}"`;
            }
            return valueStr;
          })
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filename} exported successfully!`);
  };

  const handleDownloadFullAudit = () => {
    // Format full properties data for clean CSV representation
    const formatted = properties.map((p) => ({
      'Property ID': p.property_id,
      'Municipality (City)': p.tenant,
      'Owner Name': p.owner_name,
      'Property Type': p.property_type,
      Ward: p.ward,
      'Area (sqft)': p.area_sqft,
      Status: p.status,
      'Annual Tax (INR)': p.annual_tax_inr,
      'Collection (INR)': p.collection_inr,
      'Registration Date': p.registration_date,
      'Floor Count': p.floor_count,
      Address: p.address,
    }));
    exportToCSV(formatted, 'UPYOG_Property_Audit');
  };

  const handleDownloadFinancialIndex = () => {
    // Aggregate financial metrics per city
    const cities = Array.from(new Set(properties.map((p) => p.tenant)));
    const formatted = cities.map((city) => {
      const cityProps = properties.filter((p) => p.tenant === city);
      const tax = cityProps.reduce((s, p) => s + p.annual_tax_inr, 0);
      const coll = cityProps.reduce((s, p) => s + p.collection_inr, 0);
      return {
        Municipality: city,
        'Property Count': cityProps.length,
        'Total Demand (INR)': tax,
        'Total Collection (INR)': coll,
        'Collection Rate (%)': tax > 0 ? ((coll / tax) * 100).toFixed(2) : '0.00',
      };
    });
    exportToCSV(formatted, 'UPYOG_Financial_Summary');
  };

  const handleDownloadBacklogIndex = () => {
    // Pending properties list only
    const pendingOnly = properties.filter((p) => p.status === 'Pending');
    const formatted = pendingOnly.map((p) => ({
      'Property ID': p.property_id,
      'Municipality (City)': p.tenant,
      'Owner Name': p.owner_name,
      'Property Type': p.property_type,
      Ward: p.ward,
      'Area (sqft)': p.area_sqft,
      'Annual Tax (INR)': p.annual_tax_inr,
      'Registration Date': p.registration_date,
      'Floor Count': p.floor_count,
      Address: p.address,
    }));
    exportToCSV(formatted, 'UPYOG_Backlog_Audit');
  };

  const handleDownloadEconContext = () => {
    // Export raw text file context
    const txtContent = `=== UPYOG PLATFORM DATA CONTEXT ===\nGenerated: ${new Date().toLocaleString()}\n\n` +
      `Total Properties: ${properties.length}\n` +
      `Total Approved: ${totalStats.approved}\n` +
      `Total Pending: ${totalStats.pending}\n` +
      `Total Rejected: ${totalStats.rejected}\n` +
      `Total Demand: INR ${totalStats.totalTax}\n` +
      `Total Collection: INR ${totalStats.totalCollection}\n` +
      `Collection Rate: ${totalStats.collectionRate.toFixed(2)}%\n` +
      `Average Property Tax: INR ${totalStats.avgTax.toFixed(2)}\n`;

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UPYOG_Executive_Brief_${Date.now()}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Executive Brief exported successfully!');
  };

  const reportCards = [
    {
      title: 'Complete Property Audit',
      description: 'Raw ledger of all property records under the current filter state, including architectural profiles and owners.',
      icon: Database,
      action: handleDownloadFullAudit,
      color: '#6366f1',
      badge: 'Database',
    },
    {
      title: 'Revenue Benchmarks Summary',
      description: 'Aggregated financial metrics, municipal billing totals, collection indexes, and compliance metrics.',
      icon: BadgeDollarSign,
      action: handleDownloadFinancialIndex,
      color: '#10b981',
      badge: 'Financials',
    },
    {
      title: 'Verification Backlog Log',
      description: 'Operational backlog list of registrations pending municipal physical verification and certification.',
      icon: ShieldAlert,
      action: handleDownloadBacklogIndex,
      color: '#f59e0b',
      badge: 'Compliance',
    },
    {
      title: 'AI Platform Executive Brief',
      description: 'Dense structural summary profile in flat text format, ready for direct LLM importing or briefing folders.',
      icon: FileText,
      action: handleDownloadEconContext,
      color: '#ec4899',
      badge: 'Executive',
    },
  ];

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
            Municipality Audits & Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            Download formal records, ledger files, and financial summaries formatted in CSV or raw texts
          </p>
        </div>
      </motion.div>

      {/* Interactive Summary Preview Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Table className="w-5 h-5 text-[var(--color-primary-500)]" />
          <h2 className="font-bold text-sm text-[var(--color-text-primary)]">Filtered Dataset Snapshot Preview</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)]/5 p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] tracking-wider">
              Total Scope
            </p>
            <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
              {formatNumber(properties.length)} <span className="text-[10px] text-[var(--color-text-secondary)] font-normal">records</span>
            </p>
          </div>

          <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)]/5 p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] tracking-wider">
              Aggregated Demand
            </p>
            <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
              {formatINR(totalStats.totalTax)}
            </p>
          </div>

          <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)]/5 p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] tracking-wider">
              Net Collected
            </p>
            <p className="text-lg font-bold text-emerald-500 mt-1">
              {formatINR(totalStats.totalCollection)}
            </p>
          </div>

          <div className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)]/5 p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] tracking-wider">
              Collection Rate
            </p>
            <p className="text-lg font-bold text-indigo-500 mt-1">
              {formatPercentage(totalStats.collectionRate)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between w-full">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${card.color}10`,
                    borderColor: `${card.color}20`,
                    color: card.color,
                  }}
                >
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)]">
                  {card.badge}
                </span>
              </div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)] mt-4">
                {card.title}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                {card.description}
              </p>
            </div>

            <button
              onClick={card.action}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-text-primary)] text-xs font-semibold bg-[var(--color-surface-tertiary)] hover:bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Download Audit Ledger
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
