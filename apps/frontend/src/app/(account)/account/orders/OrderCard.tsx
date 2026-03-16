import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { STATUS_LABELS } from '@/lib/constants/order';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import { STATUS_STYLES } from './page.constants';
import type { OrderCardProps } from './page.types';


export const OrderCard = ({ order }: OrderCardProps) => {
  const { t } = useLanguage();
  const itemCount = order.orderItems.reduce((sum, i) => sum + i.quantity, 0);
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className={s.orderCard}
    >
      <div className={s.orderInfo}>
        <p className={s.orderNumber}>{t('orders.order')} #{order.id.slice(-8)}</p>
        <p className={s.orderDate}>{date}</p>
      </div>
      <div className={s.orderRight}>
        <p className={s.orderAmount}>{formatCurrency(Number(order.totalAmount))}</p>
        <p className={s.orderItems}>{itemCount} {t('cart.items')}</p>
      </div>
      <Badge className={cn(STATUS_STYLES[order.status])}>
        {STATUS_LABELS[order.status] ?? order.status}
      </Badge>
      <ChevronRight className={s.orderArrow} />
    </Link>
  );
};
