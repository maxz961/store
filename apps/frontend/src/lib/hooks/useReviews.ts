'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';


interface ReviewUser {
  id: string;
  name: string | null;
  image: string | null;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  images: string[];
  adminReply: string | null;
  adminReplyAt: string | null;
  createdAt: string;
  user: ReviewUser;
}

interface CreateReviewInput {
  rating: number;
  comment?: string;
  images?: string[];
}

interface UpdateReviewInput {
  rating?: number;
  comment?: string;
  images?: string[];
}

export type ReviewSort = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface PaginatedReviews {
  data: Review[];
  total: number;
  page: number;
  totalPages: number;
}

interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
}

export interface AdminReview extends Review {
  product: ReviewProduct;
}

export interface PaginatedAdminReviews {
  data: AdminReview[];
  total: number;
  page: number;
  totalPages: number;
}

export const useProductReviews = (productId: string, sort: ReviewSort = 'newest', page: number = 1) =>
  useQuery({
    queryKey: ['reviews', productId, sort, page],
    queryFn: () => api.get<PaginatedReviews>(`/reviews/product/${productId}?sort=${sort}&page=${page}&limit=5`),
    enabled: !!productId,
    meta: { suppressGlobalError: true },
  });

export const useAdminAllReviews = (sort: ReviewSort = 'newest', page: number = 1) =>
  useQuery({
    queryKey: ['admin', 'reviews', sort, page],
    queryFn: () => api.get<PaginatedAdminReviews>(`/reviews/admin/all?sort=${sort}&page=${page}&limit=20`),
    retry: false,
    meta: { suppressGlobalError: true },
  });

export const useMyReview = (productId: string, enabled: boolean) =>
  useQuery({
    queryKey: ['reviews', 'my', productId],
    queryFn: () => api.get<Review | null>(`/reviews/my/${productId}`),
    enabled: enabled && !!productId,
    retry: false,
    meta: { suppressGlobalError: true },
  });

export const useCreateReview = (productSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateReviewInput }) =>
      api.post<Review>(`/reviews/${productId}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productSlug] });
    },
  });
};

export const useUpdateReview = (productSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: UpdateReviewInput }) =>
      api.put<Review>(`/reviews/${reviewId}`, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', result.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my', result.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productSlug] });
    },
  });
};

export const useDeleteReview = (productSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, productId }: { reviewId: string; productId: string }) =>
      api.delete(`/reviews/${reviewId}`),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productSlug] });
    },
  });
};

export const useAdminDeleteReview = (productSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, productId }: { reviewId: string; productId: string }) =>
      api.delete(`/reviews/admin/${reviewId}`),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      if (productSlug) queryClient.invalidateQueries({ queryKey: ['product', productSlug] });
    },
  });
};

export const useAdminReply = (productSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      api.post<Review>(`/reviews/admin/${reviewId}/reply`, { reply }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', result.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productSlug] });
    },
  });
};

export const useAdminDeleteReply = (productSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, productId }: { reviewId: string; productId: string }) =>
      api.delete(`/reviews/admin/${reviewId}/reply`),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productSlug] });
    },
  });
};

export const useUploadReviewImages = () =>
  useMutation({
    mutationFn: (files: File[]) =>
      api.uploadFiles<{ urls: string[] }>('/reviews/upload', files),
  });
