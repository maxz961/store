import type { Order, OrderItem } from '@/lib/hooks/useOrders';


export interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export interface OrderDetailItemProps {
  item: OrderItem;
}

export interface OrderHeaderProps {
  orderId: string;
  date: string;
}

export interface OrderStatusMetaProps {
  status: Order['status'];
  deliveryMethod: Order['deliveryMethod'];
}

export interface OrderItemsSectionProps {
  items: OrderItem[];
  totalAmount: string;
}

export interface OrderAddressSectionProps {
  deliveryMethod: Order['deliveryMethod'];
  address: Order['shippingAddress'];
}
