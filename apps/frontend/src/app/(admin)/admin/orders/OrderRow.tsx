import Link from 'next/link';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { s } from './page.styled';
import { DELIVERY_LABELS } from '@/lib/constants/order';
import { formatCurrency, formatDate } from '@/lib/constants/format';
import type { OrderRowProps } from './page.types';


export const OrderRow = ({ order }: OrderRowProps) => (
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
);
