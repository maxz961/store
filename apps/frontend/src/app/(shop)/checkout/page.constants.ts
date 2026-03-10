import { Truck, MapPin, Package } from 'lucide-react';
import type { DeliveryOption } from './page.types';

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { value: 'COURIER', label: 'Курьер', description: 'Доставка до двери', icon: Truck },
  { value: 'PICKUP', label: 'Самовывоз', description: 'Забрать из магазина', icon: MapPin },
  { value: 'POST', label: 'Почта', description: 'Почтовая доставка', icon: Package },
];

export const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Корзина', href: '/cart' },
  { label: 'Оформление заказа' },
];
