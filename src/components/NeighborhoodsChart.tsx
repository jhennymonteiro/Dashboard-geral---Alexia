import React from 'react';
import { MapPin } from 'lucide-react';

interface NeighborhoodItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface NeighborhoodsChartProps {
  neighborhoods: NeighborhoodItem[];
}

export const NeighborhoodsChart: React.FC<NeighborhoodsChartProps> = ({ neighborhoods }) => {
  const total = neighborhoods.reduce((sum, n) => sum + n.count, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 lg:p-6 flex flex-col justify-between h-full transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>Bairros dos Leads</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Distribuição geográfica por localização</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 rounded-lg border border-cyan-200/50 dark:border-cyan-800/50">
          {neighborhoods.length} {neighborhoods.length === 1 ? 'região' : 'regiões'}
        </span>
      </div>

      {/* List / Progress Bars */}
      <div className="space-y-3 my-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
        {neighborhoods.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Nenhum bairro registrado.</p>
        ) : (
          neighborhoods.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                  {item.name}
                </span>
                <div className="font-mono text-slate-900 dark:text-slate-100 font-semibold shrink-0">
                  {item.count} <span className="text-slate-400 text-[10px]">({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(item.percentage, 3)}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Total mapeado</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{total} leads</span>
      </div>
    </div>
  );
};
