import React from 'react';
import { FunnelHistorySummary } from '../lib/analytics';
import { STAGE_COLORS } from '../types';
import { History, TrendingUp, CheckCircle2, XCircle, ArrowRight, FileSpreadsheet, Clock } from 'lucide-react';

interface FunnelHistoryCardProps {
  summary: FunnelHistorySummary;
}

export const FunnelHistoryCard: React.FC<FunnelHistoryCardProps> = ({ summary }) => {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Avanço, Conversão e Perda por Etapa
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Análise detalhada baseada no histórico de movimentação dos leads
          </p>
        </div>

        <div className="flex items-center gap-2">
          {summary.hasSheetHistory ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Aba HISTÓRICO da Planilha</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Histórico do Funil</span>
            </span>
          )}
        </div>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Taxa Média de Avanço</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {summary.overallAdvancementPct.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Leads que progridem de fase
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Conversão Geral (Fechamento)</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {summary.overallConversionPct.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Entrada → Negócio Fechado
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Taxa Geral de Perda</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {summary.overallLossPct.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Desistências ou Negócio Perdido
          </p>
        </div>
      </div>

      {/* Stage-by-Stage Breakdown Grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Desempenho por Transição de Etapa
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.stageMetrics.map((item) => {
            const stageStyle = STAGE_COLORS[item.stage];
            return (
              <div
                key={item.label}
                className="bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-3"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${stageStyle.badgeBg}`}>
                      {item.stage}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {item.nextStage}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {item.totalProcessed} {item.totalProcessed === 1 ? 'lead' : 'leads'}
                  </span>
                </div>

                {/* Progress Bar Multi-Segment */}
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, item.advancedPct)}%` }}
                    className="bg-emerald-500 transition-all duration-300"
                    title={`Avanço: ${item.advancedPct.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${Math.min(100 - item.advancedPct, item.lostPct)}%` }}
                    className="bg-rose-500 transition-all duration-300"
                    title={`Perda: ${item.lostPct.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${Math.max(0, 100 - item.advancedPct - item.lostPct)}%` }}
                    className="bg-amber-400 transition-all duration-300"
                    title={`Em Andamento: ${item.retainedPct.toFixed(1)}%`}
                  />
                </div>

                {/* Stat Badges */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 p-2 rounded-lg">
                    <span className="block text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
                      Avanço
                    </span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      {item.advancedPct.toFixed(1)}%
                    </span>
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400/80">
                      ({item.advancedCount})
                    </span>
                  </div>

                  <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 p-2 rounded-lg">
                    <span className="block text-[10px] font-semibold text-rose-700 dark:text-rose-400 uppercase">
                      Perda
                    </span>
                    <span className="font-bold text-rose-800 dark:text-rose-300">
                      {item.lostPct.toFixed(1)}%
                    </span>
                    <span className="block text-[10px] text-rose-600 dark:text-rose-400/80">
                      ({item.lostCount})
                    </span>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 p-2 rounded-lg">
                    <span className="block text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase">
                      Em Andamento
                    </span>
                    <span className="font-bold text-amber-800 dark:text-amber-300">
                      {item.retainedPct.toFixed(1)}%
                    </span>
                    <span className="block text-[10px] text-amber-600 dark:text-amber-400/80">
                      ({item.retainedCount})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
