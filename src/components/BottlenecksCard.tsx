import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface BottlenecksCardProps {
  stage: string;
  nextStage?: string;
  lostQuantity: number;
  lostPct: number;
}

export const BottlenecksCard: React.FC<BottlenecksCardProps> = ({
  stage,
  nextStage = 'Conexão',
  lostQuantity,
  lostPct
}) => {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Gargalos do Funil
            </h3>
          </div>

          <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-bold px-3 py-1 rounded-full">
            Maior Evasão
          </span>
        </div>

        {/* Pink Bordered Card */}
        <div className="border border-rose-200/90 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl p-4 sm:p-5 space-y-4">
          {/* Transition Label & Evasão Pill */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-900 dark:text-rose-200 text-sm sm:text-base">
              {stage} <span className="text-rose-400 font-normal">→</span> {nextStage}
            </span>

            <span className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md shadow-2xs">
              -{lostPct.toFixed(1)}%
            </span>
          </div>

          {/* Metrics Grid (Quantidade Perdida & Taxa de Perda) */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Quantidade Perdida
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                {lostQuantity} <span className="text-xs font-normal text-slate-500">leads</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Taxa de Perda
              </div>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight mt-1">
                {lostPct.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Info Box at Bottom */}
      <div className="mt-6">
        <div className="bg-slate-950 dark:bg-slate-900 text-white rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-200 dark:text-slate-300 leading-relaxed font-medium">
            A maior perda de leads ocorre na transição de <strong className="text-white font-semibold">{stage}</strong> para <strong className="text-white font-semibold">{nextStage}</strong>, com evasão de <strong className="text-amber-300 font-bold">{lostPct.toFixed(1)}%</strong> ({lostQuantity} leads perdidos).
          </p>
        </div>
      </div>
    </div>
  );
};
