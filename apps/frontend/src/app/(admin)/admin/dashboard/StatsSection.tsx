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
      icon={<DollarSign className="h-4 w-4 text-primary" />}
    />
    <StatsCard
      label="Всего заказов"
      value={summary.ordersCount}
      subtitle={`${summary.ordersThisMonth} в этом месяце`}
      icon={<ShoppingBag className="h-4 w-4 text-primary" />}
    />
    <StatsCard
      label="Заказы за месяц"
      value={summary.ordersThisMonth}
      icon={<TrendingUp className="h-4 w-4 text-primary" />}
    />
    <StatsCard
      label="Новые пользователи"
      value={summary.newUsersThisMonth}
      subtitle="за этот месяц"
      icon={<Users className="h-4 w-4 text-primary" />}
    />
  </div>
);
