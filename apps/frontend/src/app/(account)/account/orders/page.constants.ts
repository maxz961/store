import { s } from './page.styled';

export const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Профиль', href: '/account/profile' },
  { label: 'Мои заказы' },
];

export const STATUS_STYLES: Record<string, string> = {
  PENDING: s.statusPending,
  PROCESSING: s.statusProcessing,
  SHIPPED: s.statusShipped,
  DELIVERED: s.statusDelivered,
  CANCELLED: s.statusCancelled,
};
