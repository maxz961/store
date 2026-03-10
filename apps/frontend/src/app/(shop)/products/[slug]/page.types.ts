export interface Props {
  params: Promise<{ slug: string }>;
}

export interface ProductGalleryProps {
  images: string[];
  name: string;
  selectedImage: number;
  mainImgLoaded: boolean;
  mainImgError: boolean;
  onSelectImage: (index: number) => () => void;
  onMainImgLoad: () => void;
  onMainImgError: () => void;
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
    tags: { tag: { name: string; slug: string } }[];
    reviews: { rating: number }[];
    description: string;
    id: string;
  };
  avgRating: number;
  discount: number | null;
  quantity: number;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onAddToCart: () => void;
}

export interface ProductReviewsProps {
  productId: string;
  productSlug: string;
  reviews: { rating: number }[];
  avgRating: number;
  showReviewModal: boolean;
  onOpenReviewModal: () => void;
  onCloseReviewModal: () => void;
}
