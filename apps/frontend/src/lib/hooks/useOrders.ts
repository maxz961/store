'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: string;
  currency: string;
  deliveryMethod: 'COURIER' | 'PICKUP' | 'POST';
  shippingAddress: {
    fullName: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  orderItems: OrderItem[];
}

export const useMyOrders = () =>
  useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => api.get<Order[]>('/orders/my'),
    retry: false,
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: () => api.get<Order>(`/orders/${id}`),
    enabled: !!id,
    retry: false,
  });

export type { Order, OrderItem };
