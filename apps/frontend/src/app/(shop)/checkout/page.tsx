'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Spinner } from '@/components/ui/Spinner';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCreateOrder } from '@/lib/hooks/useOrders';
import { DeliveryMethodSection } from './DeliveryMethodSection';
import { ShippingAddressSection } from './ShippingAddressSection';
import { OrderSummary } from './OrderSummary';
import { s } from './page.styled';
import type { DeliveryMethod } from './page.types';
import {
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

  const methods = useForm<CheckoutFormValues>({
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

  const onSubmit = methods.handleSubmit((data) => {
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

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className={s.layout}>
          <div className={s.formColumn}>
            <DeliveryMethodSection
              deliveryMethod={deliveryMethod}
              onSelectDelivery={handleSelectDelivery}
            />
            <ShippingAddressSection />
          </div>

          <OrderSummary
            items={items}
            totalPrice={totalPrice()}
            error={createOrder.error}
            isPending={createOrder.isPending}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default CheckoutPage;
