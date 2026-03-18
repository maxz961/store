import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import type { CheckoutSummaryItemProps } from './page.types';


export const CheckoutSummaryItem = ({ item }: CheckoutSummaryItemProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.summaryItem}>
      <div className={s.summaryItemImage}>
        <If condition={!!item.imageUrl}>
          <Then>
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className={s.summaryItemImageEl}
              sizes="48px"
            />
          </Then>
          <Else>
            <ImageOff className={s.summaryItemImageFallback} />
          </Else>
        </If>
      </div>
      <div className={s.summaryItemInfo}>
        <p className={s.summaryItemName}>{item.name}</p>
        <p className={s.summaryItemQty}>{item.quantity} {t('product.pieces')} × {formatCurrency(Number(item.price))}</p>
      </div>
    </div>
  );
};
