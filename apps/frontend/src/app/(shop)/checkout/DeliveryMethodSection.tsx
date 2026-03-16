import { useLanguage } from '@/lib/i18n';
import { DeliveryOption } from './DeliveryOption';
import { s } from './page.styled';
import type { DeliveryMethodSectionProps } from './page.types';
import { DELIVERY_OPTIONS } from './page.constants';


export const DeliveryMethodSection = ({
  deliveryMethod,
  onSelectDelivery,
}: DeliveryMethodSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>{t('checkout.delivery')}</h2>
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
};
