export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const DELIVERY_LABELS: Record<string, string> = {
  COURIER: 'Courier',
  PICKUP: 'Pickup',
  POST: 'Post office',
};

export const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export const FILTER_TABS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const PIE_COLORS: Record<string, string> = {
  PENDING: '#eab308',
  PROCESSING: '#3b82f6',
  SHIPPED: '#a855f7',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
};
