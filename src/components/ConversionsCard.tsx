import React from 'react';
import { FunnelHistoryStageMetric } from '../lib/analytics';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

interface ConversionsCardProps {
  steps: FunnelHistoryStageMetric[];
  overallConversionPct: number;
  totalEntradas?: number;
  totalFechados?: number;
}

export const ConversionsCard: React.FC<ConversionsCardProps> = ({
  steps,
  overallConversionPct,
  totalEntradas,
  totalFechados
}) => {
  // Derive fallback entries and closed counts if not explicitly passed
  const entriesCount = totalEntradas ?? (steps.length > 0 ? steps[0].totalProcessed : 0);
  const closedCount = totalFechados ?? (steps.length > 0 ? steps[steps.length - 1].advancedCount : 0);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Taxas de Conversão por Etapa
            </h3>
          </div>

          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Progresso do Funil
          </span>
        </div>

        {/* List of Transition Progress Bars */}
        <div className="space-y-5">
          {steps.map((step) => {
            const pct = Math.min(100, Math.max(0, step.advancedPct));
            return (
              <div key={step.label} className="space-y-1.5">
                {/* Row Header */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {step.stage} <span className="text-slate-400 dark:text-slate-500 font-normal">→</span> {step.nextStage}
                  </span>

                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-slate-700 dark:text-slate-300">
                      {step.advancedCount} <span className="text-slate-400 dark:text-slate-500 font-normal">/ {step.totalProcessed} leads</span>
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      ({pct.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Blue Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Box: Conversão Total do Funil */}
      <div className="mt-6 pt-2">
        <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Conversão Total do Funil
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {closedCount} {closedCount === 1 ? 'fechado' : 'fechados'} de {entriesCount} {entriesCount === 1 ? 'entrada' : 'entradas'}
              </div>
            </div>
          </div>

          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {overallConversionPct.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
