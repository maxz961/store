'use client';

import { useState, useCallback } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/lib/i18n';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import type { PaymentSectionProps } from './page.types';


export const PaymentSection = ({ amount, isCreatingOrder, onSuccess, onBack }: PaymentSectionProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handlePay = useCallback(async () => {
    if (!stripe || !elements) return;
    setError(null);
    setIsPending(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
      });

      if (stripeError) {
        setError(stripeError.message ?? t('common.error'));
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        setError(t('common.error'));
      }
    } catch {
      setError(t('common.error'));
    } finally {
      setIsPending(false);
    }
  }, [stripe, elements, onSuccess, t]);

  const isLoading = isPending || isCreatingOrder;

  return (
    <div className={s.paymentSection}>
      <p className={s.paymentTitle}>Payment</p>

      <PaymentElement />

      <When condition={!!error}>
        <p className={s.paymentError}>{error}</p>
      </When>

      <Button className={s.payButton} onClick={handlePay} disabled={isLoading || !stripe}>
        <If condition={isLoading}>
          <Then><Spinner size="sm" /></Then>
          <Else>{`Pay ${formatCurrency(amount)}`}</Else>
        </If>
      </Button>

      <button className={s.backLink} onClick={onBack} disabled={isLoading}>
        ← {t('checkout.back')}
      </button>
    </div>
  );
};
