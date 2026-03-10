'use client';

import { useMemo } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAnalyticsSummary } from '@/lib/hooks/useAdmin';
import { s } from './page.styled';
import { STATUS_LABELS, PIE_COLORS } from '@/lib/constants/order';
import { breadcrumbs } from './page.constants';
import { StatsSection } from './StatsSection';
import { OrdersByStatusCard } from './OrdersByStatusCard';
import { TopProductsCard } from './TopProductsCard';
import { RevenueChart } from './RevenueChart';


const DashboardPage = () => {
  const { data: summary, error: queryError, isLoading } = useAnalyticsSummary();
  const error = queryError ? 'Не удалось загрузить аналитику. Убедитесь, что вы администратор.' : null;

  const revenueChartData = useMemo(() => {
    if (!summary) return [];
    return summary.revenueByDay.map(({ date, revenue }) => ({
      date: new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      revenue,
    }));
  }, [summary]);

  const pieData = useMemo(() => {
    if (!summary) return [];
    return summary.ordersByStatus
      .filter(({ count }) => count > 0)
      .map(({ status, count }) => ({
        name: STATUS_LABELS[status] ?? status,
        value: count,
        color: PIE_COLORS[status] ?? '#94a3b8',
      }));
  }, [summary]);

  if (error) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <p className={s.errorText}>{error}</p>
      </div>
    );
  }

  if (isLoading || !summary) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className={s.pageTitle}>Аналитика</h1>
        <div className={s.statsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={s.statsSkeleton} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <h1 className={s.pageTitle}>Аналитика</h1>

      <StatsSection summary={summary} />

      <div className={s.chartsGrid}>
        <OrdersByStatusCard ordersByStatus={summary.ordersByStatus} pieData={pieData} />
        <TopProductsCard topProducts={summary.topProducts} />
      </div>

      <RevenueChart chartData={revenueChartData} />
    </div>
  );
};

export default DashboardPage;
