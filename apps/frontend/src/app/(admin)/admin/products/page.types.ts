export interface Product {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  price: number;
  stock: number;
  isPublished: boolean;
  hasImageError?: boolean;
  images: string[];
  category: { name: string; nameEn?: string | null } | null;
  tags: { tag: { slug: string; name: string; nameEn?: string | null; color?: string | null } }[];
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export type SortField = 'name' | 'price' | 'stock' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  sortBy: string;
  sortOrder: SortOrder;
  search?: string;
}

export interface ProductsTableProps {
  products: ProductsResponse['items'];
  sortBy: string;
  sortOrder: SortOrder;
  search?: string;
}

export interface ProductRowProps {
  product: Product;
}

export interface SortHeaderProps {
  field: SortField;
  label: string;
  align?: 'left' | 'right' | 'center';
  currentSortBy: string;
  currentSortOrder: SortOrder;
  search?: string;
}

export interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  search?: string;
  sortBy: string;
  sortOrder: SortOrder;
  view?: string;
}

export interface ProductsViewSwitchProps {
  currentView: 'all' | 'broken';
  imageErrorCount: number;
}
