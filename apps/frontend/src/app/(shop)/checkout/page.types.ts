import type { LucideIcon } from 'lucide-react';
import type { CartItem } from '@/store/cart';


export type DeliveryMethod = 'COURIER' | 'PICKUP' | 'POST';
export type CheckoutStep = 'info' | 'payment';

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

export interface DeliveryMethodSectionProps {
  deliveryMethod: DeliveryMethod;
  onSelectDelivery: (method: DeliveryMethod) => () => void;
}

export interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  step: CheckoutStep;
  error: Error | null;
  isPending: boolean;
}

export interface PaymentSectionProps {
  amount: number;
  isCreatingOrder: boolean;
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}
