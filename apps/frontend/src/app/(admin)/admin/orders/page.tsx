import Link from 'next/link';
import { When } from 'react-if';
import { api } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import { FILTER_TABS, DELIVERY_LABELS } from '@/lib/constants/order';
import { formatCurrency, formatDate } from '@/lib/constants/format';
import type { OrdersResponse } from './page.types';
import { breadcrumbs } from './page.constants';

const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) => {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.status) params.set('status', sp.status);
  if (sp.page) params.set('page', sp.page);

  const data = await api.get<OrdersResponse>(`/orders/admin?${params.toString()}`, { cache: 'no-store' });
  const currentPage = data.page;
  const activeStatus = sp.status ?? '';

  const filterTabs = (
    <div className={s.filters}>
      {FILTER_TABS.map(({ value, label }) => (
        <Link
          key={value}
          href={value ? `/admin/orders?status=${value}` : '/admin/orders'}
          className={cn(s.filterTab, activeStatus === value ? s.filterTabActive : s.filterTabInactive)}
        >
          {label}
        </Link>
      ))}
    </div>
  );

  const ordersTable = (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr>
            <th className={s.th}>Заказ</th>
            <th className={s.th}>Покупатель</th>
            <th className={s.th}>Статус</th>
            <th className={s.th}>Доставка</th>
            <th className={s.thRight}>Сумма</th>
            <th className={s.th}>Дата</th>
          </tr>
        </thead>
        <tbody>
          <When condition={data.items.length === 0}>
            <tr>
              <td colSpan={6} className={s.emptyRow}>Заказы не найдены</td>
            </tr>
          </When>
          {data.items.map((order) => (
            <tr key={order.id} className={s.tr}>
              <td className={s.td}>
                <Link href={`/admin/orders/${order.id}`} className={s.orderId}>
                  #{order.id.slice(-8)}
                </Link>
              </td>
              <td className={s.td}>
                <span className={s.customer}>{order.user?.name ?? order.user?.email ?? '—'}</span>
              </td>
              <td className={s.td}>
                <StatusBadge status={order.status} />
              </td>
              <td className={s.td}>
                <span className={s.delivery}>{DELIVERY_LABELS[order.deliveryMethod] ?? order.deliveryMethod}</span>
              </td>
              <td className={s.tdRight}>
                <span className={s.amount}>{formatCurrency(Number(order.totalAmount))}</span>
              </td>
              <td className={s.td}>
                <span className={s.date}>{formatDate(order.createdAt)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const pagination = (
    <div className={s.pagination}>
      <p className={s.pageInfo}>
        Всего {data.total} заказов · Страница {currentPage} из {data.totalPages}
      </p>
      <div className={s.pageButtons}>
        <When condition={currentPage > 1}>
          <Link href={`/admin/orders?page=${currentPage - 1}${activeStatus ? `&status=${activeStatus}` : ''}`}>
            <Button variant="outline" size="sm">Назад</Button>
          </Link>
        </When>
        <When condition={currentPage < data.totalPages}>
          <Link href={`/admin/orders?page=${currentPage + 1}${activeStatus ? `&status=${activeStatus}` : ''}`}>
            <Button variant="outline" size="sm">Вперёд</Button>
          </Link>
        </When>
      </div>
    </div>
  );

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.header}>
        <h1 className={s.title}>Заказы</h1>
      </div>

      {filterTabs}
      {ordersTable}
      {pagination}
    </div>
  );
};

export default AdminOrdersPage;
