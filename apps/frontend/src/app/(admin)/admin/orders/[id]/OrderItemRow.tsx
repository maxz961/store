import { s } from './page.styled';
import { formatCurrency } from '@/lib/constants/format';
import type { OrderItemRowProps } from './page.types';


export const OrderItemRow = ({ item }: OrderItemRowProps) => (
  <div className={s.itemRow}>
    <div>
      <p className={s.itemName}>{item.product.name}</p>
      <p className={s.itemQty}>{item.quantity} pcs. x {formatCurrency(Number(item.price))}</p>
    </div>
    <p className={s.itemPrice}>{formatCurrency(Number(item.price) * item.quantity)}</p>
  </div>
);
