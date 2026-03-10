import { MapPin } from 'lucide-react';
import { s } from './page.styled';
import type { AddressCardProps } from './page.types';

export const AddressCard = ({ address }: AddressCardProps) => (
  <div className={s.infoCard}>
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-muted-foreground" />
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
