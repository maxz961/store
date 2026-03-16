import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { formatCurrency } from '@/lib/constants/format';
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
            <div className={s.itemImageFallback}>
              Нет фото
            </div>
          </Else>
        </If>
      </Link>

      <div className={s.itemInfo}>
        <Link href={`/products/${item.slug}`} className={s.itemName}>
          {item.name}
        </Link>
        <span className={s.itemPrice}>{formatCurrency(item.price)}</span>

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
        </div>
      </div>

      <div className={s.itemRight}>
        <span className={s.itemTotal}>{formatCurrency(item.price * item.quantity)}</span>
        <button className={s.removeIconButton} onClick={onRemove} aria-label="Удалить товар">
          <Trash2 className={s.removeIcon} />
        </button>
      </div>
    </div>
  );
};
