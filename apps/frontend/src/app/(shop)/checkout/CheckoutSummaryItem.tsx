import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { s } from './page.styled';
import type { CheckoutSummaryItemProps } from './page.types';

export const CheckoutSummaryItem = ({ item }: CheckoutSummaryItemProps) => {
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
            <ImageOff className="m-auto h-5 w-5 text-muted-foreground/30" />
          </Else>
        </If>
      </div>
      <div className={s.summaryItemInfo}>
        <p className={s.summaryItemName}>{item.name}</p>
        <p className={s.summaryItemQty}>{item.quantity} шт. × ${Number(item.price).toFixed(2)}</p>
      </div>
    </div>
  );
};
