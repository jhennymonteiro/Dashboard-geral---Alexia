import React from 'react';
import { Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface AgeGroupItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface AgeGroupsChartProps {
  ageGroups: AgeGroupItem[];
}

export const AgeGroupsChart: React.FC<AgeGroupsChartProps> = ({ ageGroups }) => {
  const total = ageGroups.reduce((sum, a) => sum + a.count, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 lg:p-6 flex flex-col justify-between h-full transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Faixa Etária</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Distribuição dos leads por grupo de idade</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-48 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ageGroups} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              interval={0}
              angle={-20}
              textAnchor="end"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: any) => [`${value} leads (${((Number(value) / (total || 1)) * 100).toFixed(1)}%)`, 'Quantidade']}
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
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {ageGroups.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Total analisado</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{total} leads</span>
      </div>
    </div>
  );
};
