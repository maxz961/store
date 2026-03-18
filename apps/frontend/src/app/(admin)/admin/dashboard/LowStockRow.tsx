'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { If, Then, Else } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import { api } from '@/lib/api';
import { s } from './page.styled';
import type { LowStockRowProps } from './page.types';


export const LowStockRow = ({ id, name, nameEn, stock, image }: LowStockRowProps) => {
  const { t, lang } = useLanguage();
  const displayName = getLocalizedText(lang, name, nameEn);
  const errorReported = useRef(false);
  const badgeClass = stock <= 2 ? s.lowStockBadgeCritical : s.lowStockBadgeWarning;
  const stockLabel = stock === 0 ? t('product.outOfStock') : `${stock} ${t('admin.dashboard.pieces')}`;

  const handleImageError = () => {
    if (errorReported.current) return;
    errorReported.current = true;
    api.patch(`/products/${id}/image-error`).catch(() => undefined);
  };

  return (
    <div className={s.lowStockRow}>
      <div className={s.lowStockInfo}>
        <If condition={!!image}>
          <Then>
            <Image
              src={image!}
              alt={name}
              width={32}
              height={32}
              className={s.lowStockImage}
              unoptimized
              onError={handleImageError}
            />
          </Then>
          <Else>
            <div className={s.lowStockImage} />
          </Else>
        </If>
        <span className={s.lowStockName}>{displayName}</span>
      </div>
      <span className={badgeClass}>{stockLabel}</span>
    </div>
  );
};
