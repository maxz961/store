'use client';

import { When } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { TopProductRow } from './TopProductRow';
import { s } from './page.styled';
import type { TopProductsCardProps } from './page.types';


export const TopProductsCard = ({ topProducts }: TopProductsCardProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.dashboard.topProducts')}</h2>
      <div className={s.cardBody}>
        {topProducts.slice(0, 5).map(({ product, soldCount }, i) => (
          <TopProductRow
            key={i}
            rank={i + 1}
            productName={product?.name ?? t('admin.dashboard.unknown')}
            soldCount={soldCount}
          />
        ))}
        <When condition={topProducts.length === 0}>
          <p className={s.emptyText}>{t('admin.dashboard.noSalesData')}</p>
        </When>
      </div>
    </div>
  );
};
