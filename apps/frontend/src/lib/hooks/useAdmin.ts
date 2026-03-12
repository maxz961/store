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

export const useImageErrorCount = (enabled = true) =>
  useQuery({
    queryKey: ['admin', 'products', 'image-error-count'],
    queryFn: () => api.get<{ count: number }>('/products/admin/image-error-count'),
    enabled,
    retry: false,
  });

interface AdminProductSuggestion {
  id: string;
  name: string;
  slug: string;
  images: string[];
  isPublished: boolean;
  category: { name: string } | null;
}

interface AdminProductSuggestionsResponse {
  items: AdminProductSuggestion[];
  total: number;
  page: number;
  totalPages: number;
}

export const useAdminProductSuggestions = (query: string) =>
  useQuery({
    queryKey: ['admin', 'products', 'suggestions', query],
    queryFn: () =>
      api.get<AdminProductSuggestionsResponse>(
        `/products/admin?search=${encodeURIComponent(query)}&limit=6&sortBy=name&sortOrder=asc`,
      ),
    enabled: query.trim().length >= 2,
    staleTime: 30 * 1000,
  });

interface AdminProductsParams {
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  imageError?: boolean;
}

interface AdminProductsResponse {
  items: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    isPublished: boolean;
    hasImageError?: boolean;
    images: string[];
    category: { name: string } | null;
    tags: { tag: { slug: string; name: string } }[];
  }[];
  total: number;
  page: number;
  totalPages: number;
}

export const useAdminProducts = (params: AdminProductsParams) =>
  useQuery({
    queryKey: ['admin', 'products', 'list', params],
    queryFn: () => {
      const sp = new URLSearchParams();
      if (params.page) sp.set('page', params.page);
      if (params.search) sp.set('search', params.search);
      sp.set('sortBy', params.sortBy ?? 'createdAt');
      sp.set('sortOrder', params.sortOrder ?? 'desc');
      if (params.imageError) sp.set('imageError', 'true');
      return api.get<AdminProductsResponse>(`/products/admin?${sp.toString()}`);
    },
    retry: false,
  });

interface AdminOrdersParams {
  status?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface AdminOrdersResponse {
  items: {
    id: string;
    status: string;
    deliveryMethod: string;
    totalAmount: number;
    createdAt: string;
    user: { name: string | null; email: string } | null;
  }[];
  total: number;
  page: number;
  totalPages: number;
}

export const useAdminOrders = (params: AdminOrdersParams) =>
  useQuery({
    queryKey: ['admin', 'orders', 'list', params],
    queryFn: () => {
      const sp = new URLSearchParams();
      if (params.status) sp.set('status', params.status);
      if (params.page) sp.set('page', params.page);
      if (params.sortBy) sp.set('sortBy', params.sortBy);
      if (params.sortOrder) sp.set('sortOrder', params.sortOrder);
      return api.get<AdminOrdersResponse>(`/orders/admin?${sp.toString()}`);
    },
    retry: false,
  });

export type { AdminProductSuggestion };

export type { AnalyticsSummary, AdminOrder, CreateProductInput };
