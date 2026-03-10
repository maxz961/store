import type { LucideIcon } from 'lucide-react';

export type DeliveryMethod = 'COURIER' | 'PICKUP' | 'POST';

export interface DeliveryOption {
  value: DeliveryMethod;
  label: string;
  description: string;
  icon: LucideIcon;
}
