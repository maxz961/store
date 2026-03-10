import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { s } from './page.styled';
import type { CartItemProps } from './page.types';

export const CartItem = ({ item, onDecrease, onIncrease, onRemove }: CartItemProps) => {
  return (
    <div className={s.item}>
      <Link href={`/products/${item.slug}`} className={s.itemImageLink}>
        <If condition={!!item.imageUrl}>
          <Then>
            <Image src={item.imageUrl} alt={item.name} fill className={s.itemImage} sizes="80px" />
          </Then>
          <Else>
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Нет фото
            </div>
          </Else>
        </If>
      </Link>

      <div className={s.itemInfo}>
        <Link href={`/products/${item.slug}`} className={s.itemName}>
          {item.name}
        </Link>
        <span className={s.itemPrice}>${item.price.toFixed(2)}</span>

        <div className={s.itemActions}>
          <div className={s.quantityGroup}>
            <button
              className={s.quantityButton}
              onClick={onDecrease}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className={s.quantity}>{item.quantity}</span>
            <button
              className={s.quantityButton}
              onClick={onIncrease}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <button className={s.removeButton} onClick={onRemove}>
            Удалить
          </button>
        </div>
      </div>

      <span className={s.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  );
};
