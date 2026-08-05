import React from 'react';
import { formatCurrencyBRL } from '../lib/analytics';
import { DollarSign, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface FinancialPipelineCardProps {
  valorEntrada: number;
  valorConexao: number;
  valorAvaliacao: number;
  valorFollowUp: number;
  valorFechado: number;
  valorPerdido: number;
  activePipeline: number;
  totalPipeline: number;
}

export const FinancialPipelineCard: React.FC<FinancialPipelineCardProps> = ({
  valorEntrada,
  valorConexao,
  valorAvaliacao,
  valorFollowUp,
  valorFechado,
  valorPerdido,
  activePipeline,
  totalPipeline
}) => {
  const financialRows = [
    { label: 'Valor estimado na Entrada', value: valorEntrada, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Valor em Conexão', value: valorConexao, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Valor em Avaliação', value: valorAvaliacao, color: 'text-violet-600 dark:text-violet-400' },
    { label: 'Valor em Follow Up', value: valorFollowUp, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Valor Fechado', value: valorFechado, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Valor Perdido', value: valorPerdido, color: 'text-rose-600 dark:text-rose-400' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 lg:p-6 flex flex-col justify-between h-full transition-colors duration-200">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Pipeline Financeiro</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Valores estimados por fase do funil</p>
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2.5">
          {financialRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {row.label}
              </span>
              <span className={`text-xs font-extrabold ${row.color}`}>
                {formatCurrencyBRL(row.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total Pipeline Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-xl flex items-center justify-between border border-slate-800">
        <div>
          <span className="text-xs font-medium text-slate-400 block">Valor Total do Pipeline</span>
          <span className="text-xs text-emerald-400 font-semibold">
            Em aberto: {formatCurrencyBRL(activePipeline)}
          </span>
        </div>
        <div className="text-xl font-extrabold text-white tracking-tight">
          {formatCurrencyBRL(totalPipeline)}
        </div>
      </div>

    </div>
  );
};
