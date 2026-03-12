import { z } from 'zod';
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

export const checkoutFormSchema = z.object({
  fullName: z.string().min(2, 'Введите полное имя'),
  line1: z.string().min(1, 'Введите адрес'),
  line2: z.string(),
  city: z.string().min(1, 'Введите город'),
  state: z.string().min(1, 'Введите область'),
  postalCode: z.string().min(1, 'Введите индекс'),
  country: z.string().length(2, 'Код страны — 2 буквы (например UA)'),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
