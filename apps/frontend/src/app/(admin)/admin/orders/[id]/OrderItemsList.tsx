import { s } from './page.styled';
import { formatCurrency } from '@/lib/constants/format';
import { OrderItemRow } from './OrderItemRow';
import type { OrderItemsListProps } from './page.types';


export const OrderItemsList = ({ items, totalAmount }: OrderItemsListProps) => (
  <div className={s.itemsCard}>
    <p className={s.itemsTitle}>Items</p>
    <div className={s.itemsBody}>
      {items.map((item) => (
        <OrderItemRow key={item.id} item={item} />
      ))}
    </div>
    <div className={s.totalRow}>
      <span className={s.totalLabel}>Total</span>
      <span className={s.totalValue}>{formatCurrency(totalAmount)}</span>
    </div>
  </div>
);
