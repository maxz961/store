import { Truck } from 'lucide-react';
import { s } from './page.styled';
import { DELIVERY_LABELS } from '@/lib/constants/order';
import type { DeliveryCardProps } from './page.types';


export const DeliveryCard = ({ deliveryMethod }: DeliveryCardProps) => (
  <div className={s.infoCard}>
    <div className={s.infoTitleRow}>
      <Truck className={s.infoTitleIcon} />
      <p className={s.infoTitle}>Доставка</p>
    </div>
    <p className={s.infoValue}>{DELIVERY_LABELS[deliveryMethod] ?? deliveryMethod}</p>
  </div>
);
