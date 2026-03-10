import { MapPin } from 'lucide-react';
import { s } from './page.styled';
import type { AddressCardProps } from './page.types';


export const AddressCard = ({ address }: AddressCardProps) => (
  <div className={s.infoCard}>
    <div className={s.infoTitleRow}>
      <MapPin className={s.infoTitleIcon} />
      <p className={s.infoTitle}>Адрес</p>
    </div>
    <p className={s.infoValue}>
      {address.fullName}<br />
      {address.line1}<br />
      {address.city}, {address.state} {address.postalCode}<br />
      {address.country}
    </p>
  </div>
);
