import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/lib/i18n';
import { CheckoutSummaryItem } from './CheckoutSummaryItem';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import type { OrderSummaryProps } from './page.types';


export const OrderSummary = ({ items, totalPrice, step, error, isPending }: OrderSummaryProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.sidebar}>
      <div className={s.summaryCard}>
        <h2 className={s.summaryTitle}>{t('cart.title')}</h2>

        <div className={s.summaryItems}>
          {items.map((item) => (
            <CheckoutSummaryItem key={item.id} item={item} />
          ))}
        </div>

        <div className={s.summaryDivider} />

        <div className={s.summaryTotal}>
          <span className={s.summaryTotalLabel}>{t('cart.total')}</span>
          <span className={s.summaryTotalPrice}>{formatCurrency(totalPrice)}</span>
        </div>

        <When condition={!!error}>
          <p className={s.error}>
            {error instanceof Error ? error.message : t('common.error')}
          </p>
        </When>

        <When condition={step === 'info'}>
          <Button type="submit" size="lg" className={s.submitButton} disabled={isPending}>
            <If condition={isPending}>
              <Then><Spinner size="sm" /><span className="ml-2">{t('common.loading')}</span></Then>
              <Else>{t('checkout.submit')} →</Else>
            </If>
          </Button>
        </When>
      </div>
    </div>
  );
};
