'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Spinner } from '@/components/ui/Spinner';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/constants/format';
import { CartItem } from './CartItem';
import { s } from './page.styled';
import { breadcrumbs } from './page.constants';


const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart, hydrated } = useCartStore();

  if (!hydrated) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  const handleDecrease = (id: string, qty: number) => () => updateQuantity(id, qty - 1);

  const handleIncrease = (id: string, qty: number) => () => updateQuantity(id, qty + 1);

  const handleRemove = (id: string) => () => removeItem(id);

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.header}>
        <h1 className={s.title}>Корзина</h1>
      </div>

      <If condition={items.length === 0}>
        <Then>
          <div className={s.empty}>
            <ShoppingBag className={s.emptyIcon} />
            <p className={s.emptyTitle}>Корзина пуста</p>
            <p className={s.emptyText}>Добавьте товары из каталога</p>
            <Link href="/products">
              <Button>Перейти в каталог</Button>
            </Link>
          </div>
        </Then>
        <Else>
          <div className={s.layout}>
            <div className={s.itemsList}>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onDecrease={handleDecrease(item.id, item.quantity)}
                  onIncrease={handleIncrease(item.id, item.quantity)}
                  onRemove={handleRemove(item.id)}
                />
              ))}
          </div>

          <div className={s.summary}>
            <h2 className={s.summaryTitle}>Итого</h2>
            <div className={s.summaryRow}>
              <span>Товаров</span>
              <span>{totalItems()} шт.</span>
            </div>
            <div className={s.summaryDivider} />
            <div className={s.summaryTotal}>
              <span>Сумма</span>
              <span>{formatCurrency(totalPrice())}</span>
            </div>
            <Link href="/checkout">
              <Button size="lg" className={s.checkoutButton}>
                Оформить заказ
              </Button>
            </Link>
            <button className={s.clearButton} onClick={clearCart}>
              Очистить корзину
            </button>
          </div>
        </div>
        </Else>
      </If>
    </div>
  );
};

export default CartPage;
