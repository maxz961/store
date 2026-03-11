'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';


interface AnalyticsSummary {
  totalRevenue: number;
  ordersCount: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersByStatus: { status: string; count: number }[];
  topProducts: { product: { name: string; price: number } | undefined; soldCount: number }[];
  newUsersThisMonth: number;
  revenueByDay: { date: string; revenue: number }[];
  revenueByCategory: { categoryName: string; revenue: number }[];
  aovByDay: { date: string; aov: number }[];
  averageOrderValue: number;
  deliveryMethodDistribution: { method: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
  lowStockProducts: { id: string; name: string; slug: string; stock: number; image: string | null }[];
}

interface AdminOrder {
  id: string;
  status: string;
  deliveryMethod: string;
  totalAmount: number;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: { name: string };
  }[];
  user: { name: string | null; email: string } | null;
}

export const useAnalyticsSummary = () =>
  useQuery({
    queryKey: ['admin', 'analytics', 'summary'],
    queryFn: () => api.get<AnalyticsSummary>('/admin/analytics/summary'),
    retry: false,
  });

export const useAdminOrder = (id: string) =>
  useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => api.get<AdminOrder>(`/orders/${id}`),
    enabled: !!id,
    retry: false,
  });

export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) =>
      api.put<AdminOrder>(`/orders/${orderId}/status`, { status }),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(['admin', 'orders', orderId], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  categoryId: string;
  isPublished: boolean;
  images: string[];
  tagIds: string[];
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      api.post('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUploadProductImages = () =>
  useMutation({
    mutationFn: (files: File[]) =>
      api.uploadFiles<{ urls: string[] }>('/products/upload', files),
  });

interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateProductInput) =>
      api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export type { AnalyticsSummary, AdminOrder, CreateProductInput };
