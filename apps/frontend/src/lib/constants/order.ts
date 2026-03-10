export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает',
  PROCESSING: 'Обрабатывается',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
};

export const DELIVERY_LABELS: Record<string, string> = {
  COURIER: 'Курьер',
  PICKUP: 'Самовывоз',
  POST: 'Почта',
};

export const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export const FILTER_TABS = [
  { value: '', label: 'Все' },
  { value: 'PENDING', label: 'Ожидает' },
  { value: 'PROCESSING', label: 'Обрабатывается' },
  { value: 'SHIPPED', label: 'Отправлен' },
  { value: 'DELIVERED', label: 'Доставлен' },
  { value: 'CANCELLED', label: 'Отменён' },
];

export const PIE_COLORS: Record<string, string> = {
  PENDING: '#eab308',
  PROCESSING: '#3b82f6',
  SHIPPED: '#a855f7',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
};
