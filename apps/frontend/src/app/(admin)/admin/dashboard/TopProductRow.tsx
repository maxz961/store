'use client';

import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { TopProductRowProps } from './page.types';


export const TopProductRow = ({ rank, productName, soldCount }: TopProductRowProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.productRow}>
      <div className={s.productInfo}>
        <span className={s.productRank}>{rank}</span>
        <span className={s.productName}>{productName}</span>
      </div>
      <span className={s.productSold}>{soldCount} {t('admin.dashboard.sold')}</span>
    </div>
  );
};
