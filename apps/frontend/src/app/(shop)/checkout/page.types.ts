import type { LucideIcon } from 'lucide-react';
import type { CartItem } from '@/store/cart';

export type DeliveryMethod = 'COURIER' | 'PICKUP' | 'POST';

export interface DeliveryOption {
  value: DeliveryMethod;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface DeliveryOptionProps {
  option: DeliveryOption;
  active: boolean;
  onSelect: () => void;
}

export interface CheckoutSummaryItemProps {
  item: CartItem;
}
