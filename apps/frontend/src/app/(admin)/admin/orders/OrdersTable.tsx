import { When } from 'react-if';
import { s } from './page.styled';
import { OrderRow } from './OrderRow';
import { SortHeader } from './SortHeader';
import type { OrdersTableProps } from './page.types';


export const OrdersTable = ({ orders }: OrdersTableProps) => (
  <div className={s.tableWrapper}>
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th className={s.th}>Order</th>
          <th className={s.th}>Customer</th>
          <th className={s.th}>Status</th>
          <th className={s.th}>Delivery</th>
          <SortHeader field="totalAmount" label="Total" className={s.thSortable} />
          <SortHeader field="createdAt" label="Date" className={s.thSortable} />
        </tr>
      </thead>
      <tbody>
        <When condition={orders.length === 0}>
          <tr>
            <td colSpan={6} className={s.emptyRow}>No orders found</td>
          </tr>
        </When>
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </tbody>
    </table>
  </div>
);
