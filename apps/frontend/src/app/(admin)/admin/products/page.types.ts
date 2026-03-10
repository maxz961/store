export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isPublished: boolean;
  images: string[];
  category: { name: string } | null;
  tags: { tag: { slug: string; name: string } }[];
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductsTableProps {
  products: ProductsResponse['items'];
}

export interface ProductRowProps {
  product: Product;
}

export interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}
