import React from 'react';
import { CreditCard } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface PaymentItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface PaymentMethodsChartProps {
  paymentMethods: PaymentItem[];
}

export const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({ paymentMethods }) => {
  const total = paymentMethods.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 lg:p-6 flex flex-col justify-between h-full transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-500" />
            <span>Formas de Pagamento</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Preferência de meio de pagamento</p>
        </div>
      </div>

      {/* Chart and Legend */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Recharts Pie */}
        <div className="h-44 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentMethods}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={3}
              >
                {paymentMethods.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${value} leads (${((Number(value) / (total || 1)) * 100).toFixed(1)}%)`,
                  name
                ]}
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
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{total}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          {paymentMethods.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate text-slate-700 dark:text-slate-200 font-medium">{item.name}</span>
              </div>
              <div className="font-mono text-slate-900 dark:text-slate-100 font-semibold shrink-0 ml-2">
                {item.count} <span className="text-slate-400 text-[10px]">({item.percentage.toFixed(0)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
