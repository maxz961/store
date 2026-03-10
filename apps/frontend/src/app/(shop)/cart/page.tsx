'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useCartStore } from '@/store/cart';
import { s } from './page.styled';


const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/products' },
  { label: 'Корзина' },
];

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCartStore();

  const handleDecrease = (id: string, quantity: number) => () => updateQuantity(id, quantity - 1);

  const handleIncrease = (id: string, quantity: number) => () => updateQuantity(id, quantity + 1);

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
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
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
                <div key={item.id} className={s.item}>
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
                        onClick={handleDecrease(item.id, item.quantity)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className={s.quantity}>{item.quantity}</span>
                      <button
                        className={s.quantityButton}
                        onClick={handleIncrease(item.id, item.quantity)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button className={s.removeButton} onClick={handleRemove(item.id)}>
                      Удалить
                    </button>
                  </div>
                </div>

                <span className={s.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
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
              <span>${totalPrice().toFixed(2)}</span>
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
