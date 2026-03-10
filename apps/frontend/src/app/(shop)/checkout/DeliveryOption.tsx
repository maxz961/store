import { cn } from '@/lib/utils';
import { s } from './page.styled';
import type { DeliveryOptionProps } from './page.types';

export const DeliveryOption = ({ option, active, onSelect }: DeliveryOptionProps) => {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(s.deliveryOption, active ? s.deliveryOptionActive : s.deliveryOptionInactive)}
    >
      <Icon className={active ? s.deliveryIconActive : s.deliveryIcon} />
      <span className={s.deliveryLabel}>{option.label}</span>
      <span className={s.deliveryDescription}>{option.description}</span>
    </button>
  );
};
