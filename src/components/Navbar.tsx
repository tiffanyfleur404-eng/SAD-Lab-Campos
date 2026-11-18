import React from 'react';
import { GraduationCap, Database, Plus, Settings, ShieldCheck, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenConfigModal: () => void;
  isSupabaseConnected: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenConfigModal,
  isSupabaseConnected,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            EduRecord Pro
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            {isSupabaseConnected ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Supabase Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" /> Local Demo Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={() => setActiveTab('overview')}
          className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Student Directory
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Program Analytics
        </button>
      </nav>

      {/* Zone 3: Primary action & Settings */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenConfigModal}
          title="Supabase Configuration"
          className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>
    </header>
  );
};
