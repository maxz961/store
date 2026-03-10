'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { TextField } from '@/components/ui/TextField';
import { Spinner } from '@/components/ui/Spinner';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCreateOrder } from '@/lib/hooks/useOrders';
import { DeliveryOption } from './DeliveryOption';
import { CheckoutSummaryItem } from './CheckoutSummaryItem';
import { s } from './page.styled';
import type { DeliveryMethod } from './page.types';
import {
  DELIVERY_OPTIONS,
  breadcrumbs,
  checkoutFormSchema,
  type CheckoutFormValues,
} from './page.constants';


const CheckoutPage = () => {
  const { items, totalPrice, clearCart, hydrated } = useCartStore();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const router = useRouter();
  const createOrder = useCreateOrder();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('COURIER');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'UA',
    },
  });

  const handleSelectDelivery = (method: DeliveryMethod) => () => setDeliveryMethod(method);

  const onSubmit = handleSubmit((data) => {
    createOrder.mutate({
      deliveryMethod,
      shippingAddress: {
        ...data,
        line2: data.line2 || undefined,
      },
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    }, {
      onSuccess: (order) => {
        clearCart();
        router.push(`/account/orders/${order.id}`);
      },
    });
  });

  if (!hydrated || authLoading) {
    return (
      <div className={s.page}>
        <Spinner />
      </div>
    );
  }

  if (hydrated && items.length === 0 && !createOrder.isPending) {
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

      <form onSubmit={onSubmit} className={s.layout}>
        {/* Left column — form */}
        <div className={s.formColumn}>
          {/* Delivery method */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Способ доставки</h2>
            <div className={s.deliveryGrid}>
              {DELIVERY_OPTIONS.map((opt) => (
                <DeliveryOption
                  key={opt.value}
                  option={opt}
                  active={deliveryMethod === opt.value}
                  onSelect={handleSelectDelivery(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Адрес доставки</h2>
            <div className={s.fieldGroup}>
              <TextField
                label="Полное имя"
                placeholder="Иван Петров"
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              <TextField
                label="Адрес"
                placeholder="ул. Шевченко, 10, кв. 5"
                error={errors.line1?.message}
                {...register('line1')}
              />

              <TextField
                label="Адрес (дополнительно)"
                placeholder="Подъезд, этаж, домофон"
                error={errors.line2?.message}
                {...register('line2')}
              />

              <div className={s.fieldRow}>
                <TextField
                  label="Город"
                  placeholder="Киев"
                  error={errors.city?.message}
                  {...register('city')}
                />
                <TextField
                  label="Область / Регион"
                  placeholder="Киевская обл."
                  error={errors.state?.message}
                  {...register('state')}
                />
              </div>

              <div className={s.fieldRow}>
                <TextField
                  label="Почтовый индекс"
                  placeholder="01001"
                  error={errors.postalCode?.message}
                  {...register('postalCode')}
                />
                <TextField
                  label="Страна"
                  placeholder="UA"
                  maxLength={2}
                  error={errors.country?.message}
                  {...register('country')}
                />
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
                <CheckoutSummaryItem key={item.id} item={item} />
              ))}
            </div>

            <div className={s.summaryDivider} />

            <div className={s.summaryTotal}>
              <span className={s.summaryTotalLabel}>Итого</span>
              <span className={s.summaryTotalPrice}>${totalPrice().toFixed(2)}</span>
            </div>

            <When condition={createOrder.isError}>
              <p className={s.error}>
                {createOrder.error instanceof Error ? createOrder.error.message : 'Не удалось оформить заказ'}
              </p>
            </When>

            <Button type="submit" size="lg" className={s.submitButton} disabled={createOrder.isPending}>
              {createOrder.isPending ? 'Оформляем...' : 'Оформить заказ'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
