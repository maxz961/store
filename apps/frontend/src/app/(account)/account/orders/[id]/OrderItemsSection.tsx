import { s } from './page.styled';
import { OrderDetailItem } from './OrderDetailItem';
import type { OrderItemsSectionProps } from './page.types';


export const OrderItemsSection = ({ items, totalAmount }: OrderItemsSectionProps) => (
  <div className={s.section}>
    <div className={s.sectionHeader}>
      <p className={s.sectionTitle}>Товары</p>
    </div>
    <div className={s.sectionBody}>
      {items.map((item) => (
        <OrderDetailItem key={item.id} item={item} />
      ))}
    </div>
    <div className={s.totalRow}>
      <span className={s.totalLabel}>Итого</span>
      <span className={s.totalAmount}>${Number(totalAmount).toFixed(2)}</span>
    </div>
  </div>
);
