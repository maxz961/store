import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryHelpers';
import { buildProductsSearchParams } from '@/lib/buildProductsParams';
import { api } from '@/lib/api';
import { ProductsPageClient } from './ProductsPageClient';
import type { Category, Tag } from '@/lib/hooks/useProducts';
import type { Metadata } from 'next';


interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    categorySlug?: string;
    tagSlugs?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}


export const metadata: Metadata = {
  title: 'Catalog | Store',
  description: 'Browse our product catalog',
};


export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;

  const filters = {
    search: sp.search ?? undefined,
    categorySlug: sp.categorySlug ?? undefined,
    tagSlugs: sp.tagSlugs ?? undefined,
    page: sp.page ?? undefined,
    minPrice: sp.minPrice ?? undefined,
    maxPrice: sp.maxPrice ?? undefined,
    sortBy: sp.sortBy ?? undefined,
    sortOrder: sp.sortOrder ?? undefined,
  };

  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['products', filters],
      queryFn: () => api.get(`/products?${buildProductsSearchParams(filters)}`, { server: true }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: () => api.get<Category[]>('/categories', { server: true }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['tags'],
      queryFn: () => api.get<Tag[]>('/tags', { server: true }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsPageClient />
    </HydrationBoundary>
  );
}
