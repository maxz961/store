import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';


interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  category: { name: string; slug: string };
  tags: { tag: { name: string; slug: string } }[];
  reviews: { rating: number }[];
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: string[];
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface ProductDetail extends Product {
  description: string;
  sku: string | null;
  reviews: Review[];
}

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  _count?: { products: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  _count?: { products: number };
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

export interface CreateTagInput {
  name: string;
  slug: string;
  color?: string;
}

interface ProductsFilters {
  search?: string;
  categorySlug?: string;
  tagSlugs?: string;
  page?: string;
}

export const useProducts = (filters: ProductsFilters) => {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.categorySlug) params.set('categorySlug', filters.categorySlug);
  if (filters.tagSlugs) params.set('tagSlugs', filters.tagSlugs);
  if (filters.page) params.set('page', filters.page);

  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.get<ProductsResponse>(`/products?${params.toString()}`),
  });
};

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get<ProductDetail>(`/products/${slug}`),
    enabled: !!slug,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories'),
    staleTime: 5 * 60 * 1000,
  });

export const useTags = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: () => api.get<Tag[]>('/tags'),
    staleTime: 5 * 60 * 1000,
  });

export const useSimilarProducts = (slug: string) =>
  useQuery({
    queryKey: ['products', 'similar', slug],
    queryFn: () => api.get<Product[]>(`/products/${slug}/similar`),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ─── Category mutations ───

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) => api.post<Category>('/categories', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CreateCategoryInput> & { id: string }) =>
      api.put<Category>(`/categories/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

// ─── Tag mutations ───

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTagInput) => api.post<Tag>('/tags', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CreateTagInput> & { id: string }) =>
      api.put<Tag>(`/tags/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tags/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
  });
};
