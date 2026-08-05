import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Sparkles } from 'lucide-react';

interface ComplaintItem {
  queixa: string;
  count: number;
  percentage: number;
}

interface ComplaintsChartProps {
  complaints: ComplaintItem[];
  selectedQueixa: string | null;
  onSelectQueixa: (queixa: string | null) => void;
}

export const ComplaintsChart: React.FC<ComplaintsChartProps> = ({
  complaints,
  selectedQueixa,
  onSelectQueixa
}) => {
  const topComplaints = complaints.slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 lg:p-6 flex flex-col justify-between h-full transition-colors duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span>Distribuição por Serviços</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Serviços e procedimentos mais solicitados</p>
        </div>

        {selectedQueixa && (
          <button
            onClick={() => onSelectQueixa(null)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {/* Bar Chart Container */}
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topComplaints}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="queixa"
              width={140}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: any) => [`${value} clientes`, 'Quantidade']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                color: '#ffffff',
                border: '1px solid #334155',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              itemStyle={{ color: '#ffffff' }}
              labelStyle={{ color: '#ffffff', fontWeight: 600 }}
            />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              onClick={(data) => {
                if (data && data.queixa) {
                  onSelectQueixa(selectedQueixa === data.queixa ? null : data.queixa);
                }
              }}
              className="cursor-pointer"
            >
              {topComplaints.map((entry) => {
                const isSelected = selectedQueixa === entry.queixa;
                return (
                  <Cell
                    key={entry.queixa}
                    fill={isSelected ? '#3b82f6' : '#f59e0b'}
                    opacity={selectedQueixa && !isSelected ? 0.4 : 0.9}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranking Table List */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 gap-1.5">
        {topComplaints.map((item, idx) => {
          const isSelected = selectedQueixa === item.queixa;
          return (
            <div
              key={item.queixa}
              onClick={() => onSelectQueixa(isSelected ? null : item.queixa)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-4 text-center font-bold text-slate-400 dark:text-slate-500 text-[10px]">
                  #{idx + 1}
                </span>
                <span className="truncate">{item.queixa}</span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 shrink-0 ml-2">
                {item.count} leads <span className="text-slate-400 dark:text-slate-500 text-[10px]">({item.percentage.toFixed(0)}%)</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
