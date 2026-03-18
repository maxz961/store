'use client';

import { When } from 'react-if';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { CATEGORY_BAR_COLORS } from './page.constants';
import { formatCurrency } from '@/lib/constants/format';
import type { RevenueByCategoryCardProps } from './page.types';


export const RevenueByCategoryCard = ({ revenueByCategory }: RevenueByCategoryCardProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.dashboard.revenueByCategory')}</h2>
      <When condition={revenueByCategory.length > 0}>
        <div className={s.barChartBody}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueByCategory} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}₴`}
              />
              <YAxis
                type="category"
                dataKey="categoryName"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), t('admin.dashboard.revenue')]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                {revenueByCategory.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_BAR_COLORS[i % CATEGORY_BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </When>
      <When condition={revenueByCategory.length === 0}>
        <p className={s.emptyText}>{t('admin.dashboard.noSalesData')}</p>
      </When>
    </div>
  );
};
