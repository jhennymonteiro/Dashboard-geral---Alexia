import React from 'react';
import { PeriodFilter, SheetsConfig } from '../types';
import { RefreshCw, Sparkles, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  period: PeriodFilter;
  onPeriodChange: (p: PeriodFilter) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomDateChange: (start: string, end: string) => void;
  sheetsConfig: SheetsConfig;
  onOpenSheetsModal: () => void;
  onOpenNewLeadModal: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  viewMode: 'dashboard' | 'kanban';
  onViewModeChange: (mode: 'dashboard' | 'kanban') => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefreshData,
  isRefreshing,
  viewMode,
  onViewModeChange,
  theme = 'light',
  onToggleTheme
}) => {

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Dashboard - ORION Estética
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Acompanhamento em tempo real do funil de vendas
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons & Sheet Status */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            
            {/* View Switcher: Dashboard / Kanban */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center text-xs font-medium">
              <button
                onClick={() => onViewModeChange('dashboard')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => onViewModeChange('kanban')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Quadro Kanban
              </button>
            </div>

            {/* Manual Sync Refresh */}
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              title="Atualizar dados da planilha"
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
            </button>

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="hidden sm:inline">Escuro</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

