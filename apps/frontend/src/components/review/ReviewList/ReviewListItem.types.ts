import type { Review } from '@/lib/hooks/useReviews';


export interface ReviewListItemProps {
  review: Review;
  isOwn: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onImageClick: (url: string) => void;
}
