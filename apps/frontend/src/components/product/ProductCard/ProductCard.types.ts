export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  category: { name: string; slug: string };
  tags?: { tag: { name: string; slug: string; color?: string } }[];
  reviews?: { rating: number }[];
}

export interface Props {
  product: Product;
}
