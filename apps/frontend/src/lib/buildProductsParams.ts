export interface ProductsFilters {
  search?: string;
  categorySlug?: string;
  tagSlugs?: string;
  page?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function buildProductsSearchParams(filters: ProductsFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.categorySlug) params.set('categorySlug', filters.categorySlug);
  if (filters.tagSlugs) params.set('tagSlugs', filters.tagSlugs);
  if (filters.page) params.set('page', filters.page);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
  return params.toString();
}
