'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Spinner } from '@/components/ui/Spinner';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCreateOrder } from '@/lib/hooks/useOrders';
import { api } from '@/lib/api';
import { DeliveryMethodSection } from './DeliveryMethodSection';
import { ShippingAddressSection } from './ShippingAddressSection';
import { OrderSummary } from './OrderSummary';
import { PaymentSection } from './PaymentSection';
import { s } from './page.styled';
import type { DeliveryMethod, CheckoutStep } from './page.types';
import {
  breadcrumbs,
  checkoutFormSchema,
  type CheckoutFormValues,
} from './page.constants';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const StepBar = ({ step }: { step: CheckoutStep }) => (
  <div className={s.stepBar}>
    <div className={s.stepItem}>
      <span className={cn(s.stepDot, step === 'info' ? s.stepDotActive : s.stepDotDone)}>1</span>
      <span className={cn(step === 'info' ? s.stepLabelActive : s.stepLabelInactive)}>Доставка</span>
    </div>
    <div className={s.stepLine} />
    <div className={s.stepItem}>
      <span className={cn(s.stepDot, step === 'payment' ? s.stepDotActive : s.stepDotInactive)}>2</span>
      <span className={cn(step === 'payment' ? s.stepLabelActive : s.stepLabelInactive)}>Оплата</span>
    </div>
  </div>
);


const CheckoutPage = () => {
  const { items, totalPrice, clearCart, hydrated } = useCartStore();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const router = useRouter();
  const createOrder = useCreateOrder();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('COURIER');
  const [step, setStep] = useState<CheckoutStep>('info');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [formSnapshot, setFormSnapshot] = useState<CheckoutFormValues | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

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

  const handleInfoSubmit = useCallback(async (data: CheckoutFormValues) => {
    setIntentError(null);
    setIsCreatingIntent(true);
    try {
      const { clientSecret: secret } = await api.post<{ clientSecret: string }>(
        '/payments/create-intent',
        { amount: totalPrice() },
      );
      setClientSecret(secret);
      setFormSnapshot(data);
      setStep('payment');
    } catch {
      setIntentError('Не удалось создать платёж. Попробуйте ещё раз.');
    } finally {
      setIsCreatingIntent(false);
    }
  }, [totalPrice]);

  const handlePaymentSuccess = useCallback((paymentIntentId: string) => {
    if (!formSnapshot) return;
    createOrder.mutate(
      {
        deliveryMethod,
        shippingAddress: {
          fullName: formSnapshot.fullName,
          line1: formSnapshot.line1,
          line2: formSnapshot.line2 || undefined,
          city: formSnapshot.city,
          state: formSnapshot.state,
          postalCode: formSnapshot.postalCode,
          country: formSnapshot.country,
        },
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        paymentIntentId,
      },
      {
        onSuccess: (order) => {
          setOrderSubmitted(true);
          clearCart();
          router.push(`/account/orders/${order.id}`);
        },
      },
    );
  }, [formSnapshot, deliveryMethod, items, createOrder, clearCart, router]);

  const handleBack = useCallback(() => setStep('info'), []);

  if (!hydrated || authLoading) {
    return (
      <div className={s.page}>
        <Spinner />
      </div>
    );
  }

  if (hydrated && items.length === 0 && !createOrder.isPending && !orderSubmitted) {
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
      <StepBar step={step} />

      {step === 'info' ? (
        <FormProvider {...methods}>
          <form className={s.layout} onSubmit={methods.handleSubmit(handleInfoSubmit)}>
            <div className={s.formColumn}>
              <div className="space-y-8">
                <DeliveryMethodSection
                  deliveryMethod={deliveryMethod}
                  onSelectDelivery={handleSelectDelivery}
                />
                <ShippingAddressSection />
              </div>
            </div>

            <OrderSummary
              items={items}
              totalPrice={totalPrice()}
              step="info"
              error={intentError ? new Error(intentError) : null}
              isPending={isCreatingIntent}
            />
          </form>
        </FormProvider>
      ) : (
        <div className={s.layout}>
          <div className={s.formColumn}>
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentSection
                  amount={totalPrice()}
                  isCreatingOrder={createOrder.isPending}
                  onSuccess={handlePaymentSuccess}
                  onBack={handleBack}
                />
              </Elements>
            )}
          </div>

          <OrderSummary
            items={items}
            totalPrice={totalPrice()}
            step="payment"
            error={createOrder.error}
            isPending={false}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
