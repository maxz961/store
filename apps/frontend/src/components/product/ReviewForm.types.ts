import type { Review } from '@/lib/hooks/useReviews';

export interface ReviewFormProps {
  productId: string;
  productSlug: string;
  existingReview?: Review | null;
  onSuccess?: () => void;
}
