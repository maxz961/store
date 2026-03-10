import type { OrderItem } from '@/lib/hooks/useOrders';

export interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export interface OrderDetailItemProps {
  item: OrderItem;
}

export interface OrderDetailSkeletonProps {
  index: number;
}
