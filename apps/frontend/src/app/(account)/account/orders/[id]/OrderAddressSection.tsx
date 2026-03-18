import { When } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { OrderAddressSectionProps } from './page.types';


export const OrderAddressSection = ({ deliveryMethod, address }: OrderAddressSectionProps) => {
  const { t } = useLanguage();

  return (
    <When condition={deliveryMethod !== 'PICKUP' && !!address}>
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <p className={s.sectionTitle}>{t('orders.address')}</p>
        </div>
        <div className={s.sectionBody}>
          <p className={s.addressText}>
            {address.fullName}<br />
            {address.line1}<br />
            {address.city}, {address.state} {address.postalCode}<br />
            {address.country}
          </p>
        </div>
      </div>
    </When>
  );
};
