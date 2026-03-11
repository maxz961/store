import type { Review } from '@/lib/hooks/useReviews';


export interface ReviewCardProps {
  review: Review;
  onImageClick: (url: string) => void;
  onEditReview?: () => void;
  onDeleteReview?: (reviewId: string) => void;
  onReply?: (reviewId: string, text: string) => void;
  onDeleteReply?: (reviewId: string) => void;
}
