'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';


interface PromotionProduct {
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
  };
}

export interface Promotion {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  bannerImageUrl: string;
  bannerBgColor: string | null;
  startDate: string;
  endDate: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  isActive: boolean;
  position: number;
  link: string | null;
  createdAt: string;
  updatedAt: string;
  products: PromotionProduct[];
}

export interface ActivePromotion {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  bannerImageUrl: string;
  bannerBgColor: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  link: string | null;
}

interface CreatePromotionInput {
  title: string;
  slug: string;
  description?: string;
  bannerImageUrl: string;
  bannerBgColor?: string;
  startDate: string;
  endDate: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  isActive?: boolean;
  position?: number;
  link?: string;
  productIds?: string[];
}

type UpdatePromotionInput = Partial<CreatePromotionInput>;

export const usePromotions = () =>
  useQuery({
    queryKey: ['admin', 'promotions'],
    queryFn: () => api.get<Promotion[]>('/promotions'),
    retry: false,
  });

export const usePromotion = (id: string) =>
  useQuery({
    queryKey: ['admin', 'promotions', id],
    queryFn: () => api.get<Promotion>(`/promotions/${id}`),
    enabled: !!id,
    retry: false,
  });

export interface PublicPromotionProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  stock: number;
  isPublished: boolean;
  category: { id: string; name: string; slug: string };
  tags: { tag: { id: string; name: string; slug: string; color?: string | null } }[];
  reviews: { rating: number }[];
}

export interface PublicPromotion {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  bannerBgColor: string | null;
  products: { product: PublicPromotionProduct }[];
}

export const useActivePromotions = () =>
  useQuery({
    queryKey: ['promotions', 'active'],
    queryFn: () => api.get<ActivePromotion[]>('/promotions/active'),
    staleTime: 2 * 60 * 1000,
  });

export const usePublicPromotion = (slug: string) =>
  useQuery({
    queryKey: ['promotions', 'slug', slug],
    queryFn: () => api.get<PublicPromotion>(`/promotions/slug/${slug}`),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromotionInput) => api.post('/promotions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotions', 'active'] });
    },
  });
};

export const useUpdatePromotion = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePromotionInput) => api.put(`/promotions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotions', 'active'] });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/promotions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotions', 'active'] });
    },
  });
};
