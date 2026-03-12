import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { CheckoutSummaryItem } from './CheckoutSummaryItem';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import type { OrderSummaryProps } from './page.types';


export const OrderSummary = ({ items, totalPrice, error, isPending }: OrderSummaryProps) => (
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
        <span className={s.summaryTotalPrice}>{formatCurrency(totalPrice)}</span>
      </div>

      <When condition={!!error}>
        <p className={s.error}>
          {error instanceof Error ? error.message : 'Не удалось оформить заказ'}
        </p>
      </When>

      <Button type="submit" size="lg" className={s.submitButton} disabled={isPending}>
        <If condition={isPending}>
          <Then><Spinner size="sm" /><span className="ml-2">Оформляем...</span></Then>
          <Else>Оформить заказ</Else>
        </If>
      </Button>
    </div>
  </div>
);
