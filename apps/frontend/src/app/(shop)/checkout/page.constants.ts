import { z } from 'zod';
import { Truck, MapPin, Package } from 'lucide-react';
import type { DeliveryOption } from './page.types';


export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { value: 'COURIER', label: 'Courier', description: 'Door-to-door delivery', icon: Truck },
  { value: 'PICKUP', label: 'Pickup', description: 'Pick up from store', icon: MapPin },
  { value: 'POST', label: 'Post office', description: 'Postal delivery', icon: Package },
];

export const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Cart', href: '/cart' },
  { label: 'Checkout' },
];

export const checkoutFormSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  line1: z.string().min(1, 'Enter your address'),
  line2: z.string(),
  city: z.string().min(1, 'Enter your city'),
  state: z.string().min(1, 'Enter your region'),
  postalCode: z.string().min(1, 'Enter postal code'),
  country: z.string().length(2, 'Country code must be 2 letters (e.g. UA)'),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
