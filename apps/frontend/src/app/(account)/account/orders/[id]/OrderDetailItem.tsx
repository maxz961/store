import Link from 'next/link';
import Image from 'next/image';
import { If, Then, Else } from 'react-if';
import { s } from './page.styled';
import type { OrderDetailItemProps } from './page.types';


export const OrderDetailItem = ({ item }: OrderDetailItemProps) => (
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
            Нет фото
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
      <p className={s.itemQuantity}>{item.quantity} шт. × ${Number(item.price).toFixed(2)}</p>
    </div>
    <span className={s.itemPrice}>
      ${(Number(item.price) * item.quantity).toFixed(2)}
    </span>
  </div>
);
