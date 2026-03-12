import { When } from 'react-if';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { s } from './page.styled';
import { formatCurrency } from '@/lib/constants/format';
import type { AovTrendChartProps } from './page.types';


export const AovTrendChart = ({ chartData }: AovTrendChartProps) => (
  <When condition={chartData.length > 0}>
    <div className={s.aovCard}>
      <h2 className={s.cardTitle}>Средний чек за 30 дней</h2>
      <div className={s.chartBody}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}₴`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Средний чек']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--card))',
                fontSize: '13px',
              }}
            />
            <Line
              type="monotone"
              dataKey="aov"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3, fill: '#22c55e' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </When>
);
