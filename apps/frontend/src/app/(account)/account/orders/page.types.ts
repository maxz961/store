import type { Order } from '@/lib/hooks/useOrders';

export interface OrderCardProps {
  order: Order;
}

export interface OrderSkeletonProps {
  index: number;
}
