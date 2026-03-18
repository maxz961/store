export interface Props {
  params: Promise<{ slug: string }>;
}

export interface ProductGalleryProps {
  productId: string;
  images: string[];
  name: string;
  unoptimized?: boolean;
}

export interface ProductInfoProps {
  previewMode?: boolean;
  product: {
    name: string;
    nameEn?: string | null;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    stock: number;
    category: { name: string; nameEn?: string | null; slug: string };
    tags?: { tag: { name: string; nameEn?: string | null; slug: string; color?: string } }[];
    reviews?: { rating: number }[];
    description: string;
    descriptionEn?: string | null;
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
