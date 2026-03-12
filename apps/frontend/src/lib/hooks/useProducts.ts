import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { reportAdminError } from '@/lib/errorReporter';


interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  isPublished: boolean;
  category: { id: string; name: string; slug: string };
  tags: { tag: { id: string; name: string; slug: string } }[];
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
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const useProducts = (filters: ProductsFilters) => {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.categorySlug) params.set('categorySlug', filters.categorySlug);
  if (filters.tagSlugs) params.set('tagSlugs', filters.tagSlugs);
  if (filters.page) params.set('page', filters.page);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.get<ProductsResponse>(`/products?${params.toString()}`),
    placeholderData: keepPreviousData,
  });
};

export const useSearchSuggestions = (query: string) =>
  useQuery({
    queryKey: ['products', 'suggestions', query],
    queryFn: () => api.get<ProductsResponse>(`/products?search=${encodeURIComponent(query)}&limit=6`),
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000,
    meta: { suppressGlobalError: true },
  });

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

export const usePriceRange = () =>
  useQuery({
    queryKey: ['products', 'price-range'],
    queryFn: () => api.get<{ min: number; max: number }>('/products/price-range'),
    staleTime: 1000 * 60 * 10,
  });

// ─── Category mutations ───

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: (data: CreateCategoryInput) => api.post<Category>('/categories', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (err) => reportAdminError(err, 'Создание категории'),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: ({ id, ...data }: Partial<CreateCategoryInput> & { id: string }) =>
      api.put<Category>(`/categories/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (err) => reportAdminError(err, 'Редактирование категории'),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (err) => reportAdminError(err, 'Удаление категории'),
  });
};

// ─── Tag mutations ───

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: (data: CreateTagInput) => api.post<Tag>('/tags', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
    onError: (err) => reportAdminError(err, 'Создание тега'),
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: ({ id, ...data }: Partial<CreateTagInput> & { id: string }) =>
      api.put<Tag>(`/tags/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
    onError: (err) => reportAdminError(err, 'Редактирование тега'),
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: (id: string) => api.delete(`/tags/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
    onError: (err) => reportAdminError(err, 'Удаление тега'),
  });
};
