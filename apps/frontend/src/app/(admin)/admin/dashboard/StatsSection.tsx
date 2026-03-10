import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import type { StatsSectionProps } from './page.types';


export const StatsSection = ({ summary }: StatsSectionProps) => (
  <div className={s.statsGrid}>
    <StatsCard
      label="Общая выручка"
      value={formatCurrency(summary.totalRevenue)}
      subtitle={`${formatCurrency(summary.revenueThisMonth)} в этом месяце`}
      icon={<DollarSign className={s.statIcon} />}
    />
    <StatsCard
      label="Всего заказов"
      value={summary.ordersCount}
      subtitle={`${summary.ordersThisMonth} в этом месяце`}
      icon={<ShoppingBag className={s.statIcon} />}
    />
    <StatsCard
      label="Заказы за месяц"
      value={summary.ordersThisMonth}
      icon={<TrendingUp className={s.statIcon} />}
    />
    <StatsCard
      label="Новые пользователи"
      value={summary.newUsersThisMonth}
      subtitle="за этот месяц"
      icon={<Users className={s.statIcon} />}
    />
  </div>
);
