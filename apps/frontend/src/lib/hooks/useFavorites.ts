'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';


export interface FavoriteProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: string[];
  stock: number;
  isPublished: boolean;
  category: { name: string };
}

export interface Favorite {
  id: string;
  productId: string;
  createdAt: string;
  product: FavoriteProduct;
}

const QUERY_KEY = ['favorites'];
const IDS_QUERY_KEY = ['favorites', 'ids'];


export const useFavorites = () => {
  return useQuery<Favorite[]>({
    queryKey: QUERY_KEY,
    queryFn: () => api.get('/favorites'),
    staleTime: 1000 * 60,
  });
};

export const useFavoriteIds = (enabled = true) => {
  return useQuery<string[]>({
    queryKey: IDS_QUERY_KEY,
    queryFn: () => api.get('/favorites/ids'),
    staleTime: 1000 * 60,
    enabled,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ids: string[] }, unknown, string>({
    mutationFn: (productId: string) => api.post(`/favorites/${productId}`, {}),
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: IDS_QUERY_KEY });
      const previousIds = queryClient.getQueryData<string[]>(IDS_QUERY_KEY);
      queryClient.setQueryData<string[]>(IDS_QUERY_KEY, (old) => [...(old ?? []), productId]);
      return { previousIds };
    },
    onSuccess: (data) => {
      // Сервер вернул актуальные IDs — синхронизируем кэш без доп. запроса
      queryClient.setQueryData<string[]>(IDS_QUERY_KEY, data.ids);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err: unknown, _productId, context) => {
      queryClient.setQueryData(IDS_QUERY_KEY, (context as { previousIds?: string[] })?.previousIds);
      const message = err instanceof Error ? err.message : '';
      if (message.includes('Лимит')) {
        toast.error('Лимит избранного', {
          description: 'Можно добавить не более 50 товаров в избранное',
        });
      }
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ids: string[] }, unknown, string>({
    mutationFn: (productId: string) => api.delete(`/favorites/${productId}`),
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: IDS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousIds = queryClient.getQueryData<string[]>(IDS_QUERY_KEY);
      const previousFavorites = queryClient.getQueryData<Favorite[]>(QUERY_KEY);

      queryClient.setQueryData<string[]>(IDS_QUERY_KEY, (old) => (old ?? []).filter((id) => id !== productId));
      queryClient.setQueryData<Favorite[]>(QUERY_KEY, (old) => (old ?? []).filter((f) => f.productId !== productId));

      return { previousIds, previousFavorites };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<string[]>(IDS_QUERY_KEY, data.ids);
    },
    onError: (_err: unknown, _productId, context) => {
      const ctx = context as { previousIds?: string[]; previousFavorites?: Favorite[] };
      queryClient.setQueryData(IDS_QUERY_KEY, ctx?.previousIds);
      queryClient.setQueryData(QUERY_KEY, ctx?.previousFavorites);
    },
  });
};
