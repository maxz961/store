'use client';

import { When } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { PromotionRow } from './PromotionRow';
import type { PromotionsTableProps } from './page.types';


export const PromotionsTable = ({ promotions }: PromotionsTableProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr>
            <th className={s.th}>{t('admin.promotion.tableName')}</th>
            <th className={s.th}>{t('admin.promotion.tablePeriod')}</th>
            <th className={s.th}>{t('admin.promotion.tableDiscount')}</th>
            <th className={s.thCenter}>{t('admin.promotion.tableStatus')}</th>
            <th className={s.thCenter}>{t('admin.promotion.tablePosition')}</th>
            <th className={s.th} />
          </tr>
        </thead>
        <tbody>
          <When condition={promotions.length === 0}>
            <tr>
              <td colSpan={6} className={s.emptyRow}>{t('admin.promotion.noItems')}</td>
            </tr>
          </When>
          {promotions.map((promotion) => (
            <PromotionRow key={promotion.id} promotion={promotion} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
