import React from 'react';
import { FilterState, FunnelStage, FUNNEL_STAGES } from '../types';
import { Filter, X, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface GlobalFiltersBarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onClearFilters: () => void;
  availableOrigens: string[];
  availableQueixas: string[];
}

export const GlobalFiltersBar: React.FC<GlobalFiltersBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableOrigens,
  availableQueixas
}) => {
  const hasActiveFilters =
    filters.period !== 'todos' ||
    Boolean(filters.origem) ||
    Boolean(filters.fase) ||
    Boolean(filters.queixa) ||
    Boolean(filters.searchQuery) ||
    filters.valorMin !== null ||
    filters.valorMax !== null;

  const getPeriodLabel = () => {
    switch (filters.period) {
      case 'hoje': return 'Hoje';
      case 'ontem': return 'Ontem';
      case '7d': return 'Últimos 7 dias';
      case '30d': return 'Últimos 30 dias';
      case 'mes': return 'Este mês';
      case 'personalizado':
        if (filters.customStartDate || filters.customEndDate) {
          return `Personalizado (${filters.customStartDate || '...'} até ${filters.customEndDate || '...'})`;
        }
        return 'Personalizado';
      default: return null;
    }
  };

  const periodLabel = getPeriodLabel();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-4 mb-6 space-y-3 transition-colors duration-200">
      
      {/* Top Search & Filter Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Field (Nome or WhatsApp) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Pesquisar por Nome ou WhatsApp..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Period Dropdown */}
          <select
            value={filters.period}
            onChange={(e) => onFilterChange({ period: e.target.value as any })}
            className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="todos">Todo o Período</option>
            <option value="hoje">Hoje</option>
            <option value="ontem">Ontem</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="mes">Este mês</option>
            <option value="personalizado">Personalizado</option>
          </select>

          {/* Custom Date Range Picker */}
          {filters.period === 'personalizado' && (
            <div className="flex items-center gap-1.5 text-xs bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="date"
                value={filters.customStartDate || ''}
                onChange={(e) => onFilterChange({ customStartDate: e.target.value })}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-200 text-xs"
              />
              <span className="text-slate-400">até</span>
              <input
                type="date"
                value={filters.customEndDate || ''}
                onChange={(e) => onFilterChange({ customEndDate: e.target.value })}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-200 text-xs"
              />
            </div>
          )}

          {/* Origem Dropdown */}
          <select
            value={filters.origem || ''}
            onChange={(e) => onFilterChange({ origem: e.target.value || null })}
            className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="">Todas as Origens</option>
            {availableOrigens.map((origem) => (
              <option key={origem} value={origem}>
                {origem}
              </option>
            ))}
          </select>

          {/* Fase Dropdown */}
          <select
            value={filters.fase || ''}
            onChange={(e) => onFilterChange({ fase: (e.target.value as FunnelStage) || null })}
            className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="">Todas as Fases</option>
            {FUNNEL_STAGES.map((fase) => (
              <option key={fase} value={fase}>
                {fase}
              </option>
            ))}
          </select>

          {/* Queixa Dropdown */}
          <select
            value={filters.queixa || ''}
            onChange={(e) => onFilterChange({ queixa: e.target.value || null })}
            className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-200 font-medium max-w-[180px] truncate cursor-pointer"
          >
            <option value="">Todos os Serviços</option>
            {availableQueixas.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-800 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}

        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium mr-1 text-[11px]">Filtros ativos:</span>
          
          {periodLabel && (
            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              Período: {periodLabel}
              <button
                onClick={() => onFilterChange({ period: 'todos', customStartDate: undefined, customEndDate: undefined })}
                className="hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.origem && (
            <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              Origem: {filters.origem}
              <button onClick={() => onFilterChange({ origem: null })} className="hover:text-blue-950 dark:hover:text-blue-100 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.fase && (
            <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              Fase: {filters.fase}
              <button onClick={() => onFilterChange({ fase: null })} className="hover:text-indigo-950 dark:hover:text-indigo-100 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.queixa && (
            <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              Serviço: {filters.queixa}
              <button onClick={() => onFilterChange({ queixa: null })} className="hover:text-amber-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

    </div>
  );
};
