'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Truck, MapPin, Package, LogIn, ImageOff } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { s } from './page.styled';

type DeliveryMethod = 'COURIER' | 'PICKUP' | 'POST';

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; description: string; icon: typeof Truck }[] = [
  { value: 'COURIER', label: 'Курьер', description: 'Доставка до двери', icon: Truck },
  { value: 'PICKUP', label: 'Самовывоз', description: 'Забрать из магазина', icon: MapPin },
  { value: 'POST', label: 'Почта', description: 'Почтовая доставка', icon: Package },
];

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Корзина', href: '/cart' },
  { label: 'Оформление заказа' },
];

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('COURIER');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'UA',
  });

  useEffect(() => {
    setHydrated(true);
  }, []);

  const updateField = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const order = await api.post<{ id: string }>('/orders', {
        deliveryMethod,
        shippingAddress: address,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });

      clearCart();
      router.push(`/account/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось оформить заказ');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated || authLoading) {
    return (
      <div className={s.page}>
        <div className={s.loading}>
          <div className={s.spinner} />
        </div>
      </div>
    );
  }

  if (hydrated && items.length === 0 && !submitting) {
    router.replace('/cart');
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <div className={s.authCard}>
          <LogIn className={s.authIcon} />
          <h1 className={s.authTitle}>Войдите, чтобы оформить заказ</h1>
          <p className={s.authText}>Для оформления заказа необходима авторизация</p>
          <Button onClick={login} size="lg">
            Войти через Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <form onSubmit={handleSubmit} className={s.layout}>
        {/* Left column — form */}
        <div className={s.formColumn}>
          {/* Delivery method */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Способ доставки</h2>
            <div className={s.deliveryGrid}>
              {DELIVERY_OPTIONS.map((opt) => {
                const active = deliveryMethod === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDeliveryMethod(opt.value)}
                    className={cn(s.deliveryOption, active ? s.deliveryOptionActive : s.deliveryOptionInactive)}
                  >
                    <Icon className={active ? s.deliveryIconActive : s.deliveryIcon} />
                    <span className={s.deliveryLabel}>{opt.label}</span>
                    <span className={s.deliveryDescription}>{opt.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shipping address */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Адрес доставки</h2>
            <div className={s.fieldGroup}>
              <div>
                <label className={s.label}>Полное имя</label>
                <input
                  className={s.input}
                  placeholder="Иван Петров"
                  required
                  value={address.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
              </div>

              <div>
                <label className={s.label}>Адрес</label>
                <input
                  className={s.input}
                  placeholder="ул. Шевченко, 10, кв. 5"
                  required
                  value={address.line1}
                  onChange={(e) => updateField('line1', e.target.value)}
                />
              </div>

              <div>
                <label className={s.label}>Адрес (дополнительно)</label>
                <input
                  className={s.input}
                  placeholder="Подъезд, этаж, домофон"
                  value={address.line2}
                  onChange={(e) => updateField('line2', e.target.value)}
                />
              </div>

              <div className={s.fieldRow}>
                <div>
                  <label className={s.label}>Город</label>
                  <input
                    className={s.input}
                    placeholder="Киев"
                    required
                    value={address.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className={s.label}>Область / Регион</label>
                  <input
                    className={s.input}
                    placeholder="Киевская обл."
                    required
                    value={address.state}
                    onChange={(e) => updateField('state', e.target.value)}
                  />
                </div>
              </div>

              <div className={s.fieldRow}>
                <div>
                  <label className={s.label}>Почтовый индекс</label>
                  <input
                    className={s.input}
                    placeholder="01001"
                    required
                    value={address.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                  />
                </div>
                <div>
                  <label className={s.label}>Страна</label>
                  <input
                    className={s.input}
                    placeholder="UA"
                    required
                    maxLength={2}
                    value={address.country}
                    onChange={(e) => updateField('country', e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — order summary */}
        <div className={s.sidebar}>
          <div className={s.summaryCard}>
            <h2 className={s.summaryTitle}>Ваш заказ</h2>

            <div className={s.summaryItems}>
              {items.map((item) => (
                <div key={item.id} className={s.summaryItem}>
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
              ))}
            </div>

            <div className={s.summaryDivider} />

            <div className={s.summaryTotal}>
              <span className={s.summaryTotalLabel}>Итого</span>
              <span className={s.summaryTotalPrice}>${totalPrice().toFixed(2)}</span>
            </div>

            <When condition={!!error}>
              <p className={s.error}>{error}</p>
            </When>

            <Button type="submit" size="lg" className={s.submitButton} disabled={submitting}>
              {submitting ? 'Оформляем...' : 'Оформить заказ'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
