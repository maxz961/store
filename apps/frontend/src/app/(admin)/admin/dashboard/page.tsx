'use client';

import { useEffect, useState, useMemo } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { When } from 'react-if';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { api } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StatsCard } from '@/components/admin/StatsCard';
import { s, statusDotColors } from './page.styled';


interface AnalyticsSummary {
  totalRevenue: number;
  ordersCount: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersByStatus: { status: string; count: number }[];
  topProducts: { product: { name: string; price: number } | undefined; soldCount: number }[];
  newUsersThisMonth: number;
  revenueByDay: { date: string; revenue: number }[];
}

const PIE_COLORS: Record<string, string> = {
  PENDING: '#eab308',
  PROCESSING: '#3b82f6',
  SHIPPED: '#a855f7',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает',
  PROCESSING: 'Обрабатывается',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
};

const breadcrumbs = [
  { label: 'Админ-панель' },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 }).format(value);

const DashboardPage = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<AnalyticsSummary>('/admin/analytics/summary')
      .then(setSummary)
      .catch(() => setError('Не удалось загрузить аналитику. Убедитесь, что вы администратор.'));
  }, []);

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

  if (!summary) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className={`${s.title} mt-6`}>Аналитика</h1>
        <div className={s.statsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }

  const statsCards = (
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

  const ordersByStatusCard = (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Заказы по статусам</h2>
      <div className="mt-4">
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
              <Tooltip formatter={(value: number) => [`${value} шт.`]} />
            </PieChart>
          </ResponsiveContainer>
        </When>
        <div className="mt-4 space-y-1">
          {summary.ordersByStatus.map(({ status, count }) => (
            <div key={status} className={s.statusRow}>
              <div className="flex items-center">
                <span className={`${s.statusDot} ${statusDotColors[status] ?? 'bg-muted'}`} />
                <span className={s.statusLabel}>{STATUS_LABELS[status] ?? status}</span>
              </div>
              <span className={s.statusCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const topProductsCard = (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Топ товары</h2>
      <div className="mt-4">
        {summary.topProducts.slice(0, 5).map(({ product, soldCount }, i) => (
          <div key={i} className={s.productRow}>
            <div className="flex items-center min-w-0">
              <span className={s.productRank}>{i + 1}</span>
              <span className={s.productName}>{product?.name ?? 'Неизвестный'}</span>
            </div>
            <span className={s.productSold}>{soldCount} продано</span>
          </div>
        ))}
        <When condition={summary.topProducts.length === 0}>
          <p className={s.emptyText}>Нет данных о продажах</p>
        </When>
      </div>
    </div>
  );

  const revenueChart = (
    <When condition={revenueChartData.length > 0}>
      <div className={s.revenueCard}>
        <h2 className={s.cardTitle}>Выручка за 30 дней</h2>
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                formatter={(value: number) => [formatCurrency(value), 'Выручка']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  fontSize: '13px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </When>
  );

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <h1 className={`${s.title} mt-6`}>Аналитика</h1>

      {statsCards}

      <div className={s.chartsGrid}>
        {ordersByStatusCard}
        {topProductsCard}
      </div>

      {revenueChart}
    </div>
  );
};

export default DashboardPage;
