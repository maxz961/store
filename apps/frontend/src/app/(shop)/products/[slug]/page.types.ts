export interface Props {
  params: Promise<{ slug: string }>;
}

export interface ProductGalleryProps {
  images: string[];
  name: string;
  unoptimized?: boolean;
}

export interface ProductInfoProps {
  product: {
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    stock: number;
    category: { name: string; slug: string };
    tags?: { tag: { name: string; slug: string; color?: string } }[];
    reviews?: { rating: number }[];
    description: string;
    id: string;
  };
}

export interface ProductReviewsProps {
  productId: string;
  productSlug: string;
  reviews: { rating: number }[];
}

export interface SimilarProductsProps {
  slug: string;
}

export interface RecentlyViewedProps {
  currentProductId: string;
}
