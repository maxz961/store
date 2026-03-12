import { When } from 'react-if';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { s } from './page.styled';
import { DELIVERY_BAR_COLOR } from './page.constants';
import type { DeliveryMethodCardProps } from './page.types';


export const DeliveryMethodCard = ({ data }: DeliveryMethodCardProps) => (
  <div className={s.card}>
    <h2 className={s.cardTitle}>Способы доставки</h2>
    <When condition={data.length > 0}>
      <div className={s.barChartBody}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip
              formatter={(value: number) => [`${value} шт.`, 'Заказов']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--card))',
                fontSize: '13px',
              }}
            />
            <Bar dataKey="count" fill={DELIVERY_BAR_COLOR} radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </When>
    <When condition={data.length === 0}>
      <p className={s.emptyText}>Нет данных</p>
    </When>
  </div>
);
