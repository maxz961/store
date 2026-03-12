'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { s } from './page.styled';
import { DELIVERY_LABELS } from '@/lib/constants/order';
import { formatCurrency, formatDate } from '@/lib/constants/format';
import type { OrderRowProps } from './page.types';


export const OrderRow = ({ order }: OrderRowProps) => {
  const router = useRouter();

  const handleRowClick = useCallback(() => {
    router.push(`/admin/orders/${order.id}`);
  }, [router, order.id]);

  return (
    <tr className={s.tr} onClick={handleRowClick}>
      <td className={s.td}>
        <span className={s.orderId}>#{order.id.slice(-8)}</span>
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
  );
};
