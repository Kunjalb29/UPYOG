import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/useThemeStore';
import { Settings, Shield, Sliders, ToggleLeft, Key, Mail, Cpu, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const [exportFormat, setExportFormat] = useState('csv');
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem('UPYOG_GEMINI_API_KEY') || ''
  );
  const [apiKeyStatus, setApiKeyStatus] = useState<boolean>(
    !!import.meta.env.VITE_GEMINI_API_KEY || !!localStorage.getItem('UPYOG_GEMINI_API_KEY')
  );

  // Switch toggles (simulated state)
  const [notifApprovals, setNotifApprovals] = useState(true);
  const [notifRevenue, setNotifRevenue] = useState(false);
  const [notifAudits, setNotifAudits] = useState(true);

  const handleSaveSettings = () => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      localStorage.setItem('UPYOG_GEMINI_API_KEY', apiKey.trim());
      setApiKeyStatus(!!apiKey.trim() || !!import.meta.env.VITE_GEMINI_API_KEY);
    }
    toast.success('System preferences saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4"
      >
        <Settings className="w-6 h-6 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">System Preferences & Settings</h1>
          <p className="text-sm mt-0.5 text-[var(--color-text-tertiary)]">
            Configure UPYOG municipality platform variables, styling templates, and security variables
          </p>
        </div>
      </motion.div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/40">
            <Sliders className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Platform Styling</h3>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Choose your theme layout. Dark mode is optimized for low-light municipal dashboard environments.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => setTheme('light')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  theme === 'light'
                    ? 'border-[var(--color-text-primary)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] font-bold'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)]'
                }`}
              >
                Light Theme
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'border-[var(--color-text-primary)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] font-bold'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)]'
                }`}
              >
                Dark Theme
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI & Integration Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/40">
            <Cpu className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Cognitive Analytics Engine</h3>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
              Real-time platform cognitive metrics are driven by secure LLM analytics models. Configure access keys below.
            </p>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-secondary)]">Integration Status:</span>
                {apiKeyStatus ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {import.meta.env.VITE_GEMINI_API_KEY ? 'Connected (System Key)' : 'Connected (Custom Key)'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    Missing API Key
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Key className="w-4.5 h-4.5 text-[var(--color-text-tertiary)] shrink-0" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={import.meta.env.VITE_GEMINI_API_KEY ? 'System Key Configured' : 'Enter API access key...'}
                  disabled={!!import.meta.env.VITE_GEMINI_API_KEY}
                  className={`flex-1 bg-[var(--color-surface-tertiary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-[var(--color-text-primary)] outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                    import.meta.env.VITE_GEMINI_API_KEY ? 'opacity-70 cursor-not-allowed bg-black/5 dark:bg-white/5' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Rules Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/40">
            <Shield className="w-4.5 h-4.5 text-emerald-500" />
            <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Data Audit Preferences</h3>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Configure default file encoding structures when downloading formal municipal property ledgers.
            </p>

            <div className="space-y-2 mt-2">
              <label className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] tracking-wider">
                Export Target Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full bg-[var(--color-surface-tertiary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-xs text-[var(--color-text-primary)] focus:outline-none"
              >
                <option value="csv">Standard Delimited CSV (.csv)</option>
                <option value="txt">Flat Text Briefing (.txt)</option>
                <option value="json">Raw Structured JSON (.json)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Real-time Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/40">
            <Mail className="w-4.5 h-4.5 text-amber-500" />
            <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Municipal Alerts</h3>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Toggle specific push triggers for physical verification backlogs or compliance reviews.
            </p>

            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-secondary)] font-medium">New Application Approvals</span>
                <input
                  type="checkbox"
                  checked={notifApprovals}
                  onChange={(e) => setNotifApprovals(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-secondary)] font-medium">Weekly Compliance Audits</span>
                <input
                  type="checkbox"
                  checked={notifAudits}
                  onChange={(e) => setNotifAudits(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-secondary)] font-medium">Revenue Target Alerts</span>
                <input
                  type="checkbox"
                  checked={notifRevenue}
                  onChange={(e) => setNotifRevenue(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 space-y-4"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/40">
          <HelpCircle className="w-4.5 h-4.5 text-blue-500" />
          <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Platform Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">Application Name:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">UPYOG Tax Analytics Dashboard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">Release Phase:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">Production v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">License Status:</span>
              <span className="font-semibold text-emerald-500">Authorized Municipal Copy</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">Framework:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">React + Vite (TypeScript)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">Styling Engine:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">Tailwind CSS (v4)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">UI Layer:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">Framer Motion + Recharts</span>
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow cursor-pointer active:scale-[0.98]"
          >
            Save All Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
}
