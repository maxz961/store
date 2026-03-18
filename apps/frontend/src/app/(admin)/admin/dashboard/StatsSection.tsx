'use client';

import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { formatCurrency } from '@/lib/constants/format';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { StatsSectionProps } from './page.types';


export const StatsSection = ({ summary }: StatsSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.statsGrid}>
      <StatsCard
        label={t('admin.dashboard.totalRevenue')}
        value={formatCurrency(summary.totalRevenue)}
        subtitle={`${formatCurrency(summary.revenueThisMonth)} ${t('admin.dashboard.thisMonth')}`}
        icon={<DollarSign className={s.statIcon} />}
      />
      <StatsCard
        label={t('admin.dashboard.totalOrders')}
        value={summary.ordersCount}
        subtitle={`${summary.ordersThisMonth} ${t('admin.dashboard.thisMonth')}`}
        icon={<ShoppingBag className={s.statIcon} />}
      />
      <StatsCard
        label={t('admin.dashboard.ordersThisMonth')}
        value={summary.ordersThisMonth}
        icon={<TrendingUp className={s.statIcon} />}
      />
      <StatsCard
        label={t('admin.dashboard.newUsers')}
        value={summary.newUsersThisMonth}
        subtitle={t('admin.dashboard.thisMonth')}
        icon={<Users className={s.statIcon} />}
      />
    </div>
  );
};
