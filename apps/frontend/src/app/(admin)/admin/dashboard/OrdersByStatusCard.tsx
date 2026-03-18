'use client';

import { When } from 'react-if';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { useLanguage } from '@/lib/i18n';
import { StatusRow } from './StatusRow';
import { s } from './page.styled';
import type { OrdersByStatusCardProps } from './page.types';


export const OrdersByStatusCard = ({ ordersByStatus, pieData }: OrdersByStatusCardProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.dashboard.byStatus')}</h2>
      <div className={s.cardBody}>
        <When condition={pieData.length > 0}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} ${t('admin.dashboard.pieces')}`]} />
            </PieChart>
          </ResponsiveContainer>
        </When>
        <div className={s.statusList}>
          {ordersByStatus.map(({ status, count }) => (
            <StatusRow key={status} status={status} count={count} />
          ))}
        </div>
      </div>
    </div>
  );
};
