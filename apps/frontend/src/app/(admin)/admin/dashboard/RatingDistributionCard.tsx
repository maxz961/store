'use client';

import { When } from 'react-if';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { RATING_BAR_COLORS } from './page.constants';
import type { RatingDistributionCardProps } from './page.types';


export const RatingDistributionCard = ({ data }: RatingDistributionCardProps) => {
  const { t } = useLanguage();

  const chartData = [5, 4, 3, 2, 1].map((rating) => {
    const found = data.find((d) => d.rating === rating);
    return { label: `${rating} ★`, count: found?.count ?? 0, rating };
  });

  const hasData = data.length > 0;

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.dashboard.ratingDistribution')}</h2>
      <When condition={hasData}>
        <div className={s.barChartBody}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
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
                width={50}
              />
              <Tooltip
                formatter={(value: number) => [`${value} ${t('admin.dashboard.reviews')}`]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                {chartData.map((entry) => (
                  <Cell key={entry.rating} fill={RATING_BAR_COLORS[entry.rating]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </When>
      <When condition={!hasData}>
        <p className={s.emptyText}>{t('admin.dashboard.noReviews')}</p>
      </When>
    </div>
  );
};
