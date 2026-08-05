import React from 'react';
import { FunnelStage, STAGE_COLORS } from '../types';
import { StageFunnelMetrics, FunnelHistorySummary, getWorstBottleneck } from '../lib/analytics';
import { AlertTriangle, ArrowDown, Filter, FileSpreadsheet, Clock } from 'lucide-react';

interface FunnelChartProps {
  funnelMetrics: StageFunnelMetrics[];
  historySummary: FunnelHistorySummary;
  selectedStage: FunnelStage | null;
  onSelectStage: (stage: FunnelStage | null) => void;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  funnelMetrics,
  historySummary,
  selectedStage,
  onSelectStage
}) => {
  const stages: FunnelStage[] = ['Entrada', 'Conexão', 'Avaliação', 'Follow Up', 'Negócio Fechado'];

  // Width percentages to create a visual vertical funnel taper
  const stageWidths: Record<FunnelStage, string> = {
    'Entrada': 'w-full',
    'Conexão': 'w-[88%]',
    'Avaliação': 'w-[76%]',
    'Follow Up': 'w-[64%]',
    'Negócio Fechado': 'w-[52%]',
    'Negócio Perdido': 'w-[40%]'
  };

  // Helper to get count for a stage
  const getStageCount = (stageName: FunnelStage): number => {
    const item = funnelMetrics.find((f) => f.stage === stageName);
    return item ? item.countCurrent : 0;
  };

  // Helper to get advance percentage from historySummary or funnelMetrics
  const getAdvancePct = (stageName: FunnelStage): number | null => {
    if (stageName === 'Negócio Fechado') return null; // Final stage

    if (historySummary && historySummary.stageMetrics) {
      const histMetric = historySummary.stageMetrics.find((s) => s.stage === stageName);
      if (histMetric !== undefined && histMetric.advancedPct !== undefined) {
        return histMetric.advancedPct;
      }
    }

    const metric = funnelMetrics.find((f) => f.stage === stageName);
    return metric ? metric.conversionToNextPct : 0;
  };

  // Worst Bottleneck calculation
  const bottleneck = getWorstBottleneck([], historySummary);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-5 lg:p-7 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Funil Comercial
            </h3>
            {selectedStage && (
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-indigo-500" />
                <span>Filtro: {selectedStage}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualização em funil com taxas de avanço por etapa
          </p>
        </div>

        <div className="flex items-center gap-3">
          {historySummary?.hasSheetHistory ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Aba HISTÓRICO</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Histórico de Leads</span>
            </span>
          )}

          {selectedStage && (
            <button
              onClick={() => onSelectStage(null)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold underline cursor-pointer"
            >
              Limpar filtro
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Visual Stage Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 items-center">
        {stages.map((stage, idx) => {
          const count = getStageCount(stage);
          const advancePct = getAdvancePct(stage);
          const isSelected = selectedStage === stage;
          const isLast = idx === stages.length - 1;
          const stageStyle = STAGE_COLORS[stage];

          return (
            <React.Fragment key={stage}>
              {/* Stage Card */}
              <div
                onClick={() => onSelectStage(isSelected ? null : stage)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
                  isSelected
                    ? 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md'
                    : 'bg-slate-50/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-900/90 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${stageStyle.badgeBg}`}>
                      {stage}
                    </span>
                  </div>

                  <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-mono">
                    {count}
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                    Leads
                  </div>
                </div>

                {!isLast && advancePct !== null && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Avanço</span>
                    <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/70 px-2 py-0.5 rounded-full">
                      ↓ {advancePct.toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
};

