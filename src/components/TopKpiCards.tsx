import React from 'react';
import { formatCurrencyBRL } from '../lib/analytics';
import { Users, Filter, CheckCircle2, XCircle, DollarSign, TrendingUp } from 'lucide-react';

interface TopKpiCardsProps {
  totalLeads: number;
  totalActiveCount: number;
  totalFechadosCount: number;
  valorFechado: number;
  totalPerdidosCount: number;
  valorPerdido?: number;
  valorEmNegociacao: number;
  conversaoGeralPct: number;
}

export const TopKpiCards: React.FC<TopKpiCardsProps> = ({
  totalLeads,
  totalActiveCount,
  totalFechadosCount,
  valorFechado,
  totalPerdidosCount,
  valorPerdido = 0,
  valorEmNegociacao,
  conversaoGeralPct
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      
      {/* 1. Leads Recebidos */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Leads Recebidos
          </span>
          <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {totalLeads}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Total de contatos recebidos</p>
      </div>

      {/* 2. Pipeline Ativo */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pipeline Ativo
          </span>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {totalActiveCount}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Em andamento no funil</p>
      </div>

      {/* 3. Negócios Fechados */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-linear-to-br from-white to-emerald-50/30 dark:from-slate-800 dark:to-emerald-950/20 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            Negócios Fechados
          </span>
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-950 dark:text-emerald-300 tracking-tight">
            {totalFechadosCount}
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            ({formatCurrencyBRL(valorFechado)})
          </span>
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Vendas concluídas</p>
      </div>

      {/* 4. Negócios Perdidos */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Negócios Perdidos
          </span>
          <div className="p-2 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {totalPerdidosCount}
          </span>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            ({formatCurrencyBRL(valorPerdido)})
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Descartados ou recusados</p>
      </div>

      {/* 5. Valor em Negociação */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Em Negociação
          </span>
          <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {formatCurrencyBRL(valorEmNegociacao)}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Valor estimado em aberto</p>
      </div>

      {/* 6. Conversão Geral */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Conversão Geral
          </span>
          <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
          {conversaoGeralPct.toFixed(1)}%
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Fechados ÷ Recebidos</p>
      </div>

    </div>
  );
};
