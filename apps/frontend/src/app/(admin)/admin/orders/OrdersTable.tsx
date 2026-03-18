'use client';

import { When } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { OrderRow } from './OrderRow';
import { SortHeader } from './SortHeader';
import type { OrdersTableProps } from './page.types';


export const OrdersTable = ({ orders }: OrdersTableProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr>
            <th className={s.th}>{t('admin.order.title')}</th>
            <th className={s.th}>{t('admin.order.customer')}</th>
            <th className={s.th}>{t('admin.order.status')}</th>
            <th className={s.th}>{t('admin.order.delivery')}</th>
            <SortHeader field="totalAmount" label={t('admin.order.total')} className={s.thSortable} />
            <SortHeader field="createdAt" label={t('admin.order.tableDate')} className={s.thSortable} />
          </tr>
        </thead>
        <tbody>
          <When condition={orders.length === 0}>
            <tr>
              <td colSpan={6} className={s.emptyRow}>{t('admin.order.noItems')}</td>
            </tr>
          </When>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
