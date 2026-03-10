import type { Review } from '@/lib/hooks/useReviews';


export interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string | null;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}
