import { useLanguage } from '@/lib/i18n';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import { OrderDetailItem } from './OrderDetailItem';
import type { OrderItemsSectionProps } from './page.types';


export const OrderItemsSection = ({ items, totalAmount }: OrderItemsSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.section}>
      <div className={s.sectionHeader}>
        <p className={s.sectionTitle}>{t('admin.order.items')}</p>
      </div>
      <div className={s.sectionBody}>
        {items.map((item) => (
          <OrderDetailItem key={item.id} item={item} />
        ))}
      </div>
      <div className={s.totalRow}>
        <span className={s.totalLabel}>{t('cart.total')}</span>
        <span className={s.totalAmount}>{formatCurrency(Number(totalAmount))}</span>
      </div>
    </div>
  );
};
