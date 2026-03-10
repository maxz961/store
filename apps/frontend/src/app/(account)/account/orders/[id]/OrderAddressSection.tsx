import { When } from 'react-if';
import { s } from './page.styled';
import type { OrderAddressSectionProps } from './page.types';


export const OrderAddressSection = ({ deliveryMethod, address }: OrderAddressSectionProps) => (
  <When condition={deliveryMethod !== 'PICKUP' && !!address}>
    <div className={s.section}>
      <div className={s.sectionHeader}>
        <p className={s.sectionTitle}>Адрес доставки</p>
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
