import { DeliveryOption } from './DeliveryOption';
import { s } from './page.styled';
import type { DeliveryMethodSectionProps } from './page.types';
import { DELIVERY_OPTIONS } from './page.constants';


export const DeliveryMethodSection = ({
  deliveryMethod,
  onSelectDelivery,
}: DeliveryMethodSectionProps) => (
  <div className={s.section}>
    <h2 className={s.sectionTitle}>Способ доставки</h2>
    <div className={s.deliveryGrid}>
      {DELIVERY_OPTIONS.map((opt) => (
        <DeliveryOption
          key={opt.value}
          option={opt}
          active={deliveryMethod === opt.value}
          onSelect={onSelectDelivery(opt.value)}
        />
      ))}
    </div>
  </div>
);
