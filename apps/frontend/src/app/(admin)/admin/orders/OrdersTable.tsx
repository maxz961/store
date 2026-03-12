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
          <th className={s.th}>Заказ</th>
          <th className={s.th}>Покупатель</th>
          <th className={s.th}>Статус</th>
          <th className={s.th}>Доставка</th>
          <SortHeader field="totalAmount" label="Сумма" className={s.thSortable} />
          <SortHeader field="createdAt" label="Дата" className={s.thSortable} />
        </tr>
      </thead>
      <tbody>
        <When condition={orders.length === 0}>
          <tr>
            <td colSpan={6} className={s.emptyRow}>Заказы не найдены</td>
          </tr>
        </When>
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </tbody>
    </table>
  </div>
);
