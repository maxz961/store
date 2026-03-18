export interface Product {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  category: { name: string; nameEn?: string | null; slug: string };
  tags?: { tag: { name: string; nameEn?: string | null; slug: string; color?: string | null } }[];
  reviews?: { rating: number }[];
}

export interface Props {
  product: Product;
}
