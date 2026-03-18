import Link from 'next/link';
import Image from 'next/image';
import { If, Then, Else } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import type { OrderDetailItemProps } from './page.types';


export const OrderDetailItem = ({ item }: OrderDetailItemProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.item}>
      <div className={s.itemImageWrapper}>
        <If condition={!!item.product.images[0]}>
          <Then>
            <Image
              src={item.product.images[0]}
              alt={item.product.name}
              fill
              className={s.itemImage}
              sizes="56px"
            />
          </Then>
          <Else>
            <div className={s.imageFallback}>
              {t('product.noPhoto')}
            </div>
          </Else>
        </If>
      </div>
      <div className={s.itemInfo}>
        <Link
          href={`/products/${item.product.slug}`}
          className={s.itemName}
        >
          {item.product.name}
        </Link>
        <p className={s.itemQuantity}>{item.quantity} {t('product.pieces')} × {formatCurrency(Number(item.price))}</p>
      </div>
      <span className={s.itemPrice}>
        {formatCurrency(Number(item.price) * item.quantity)}
      </span>
    </div>
  );
};
