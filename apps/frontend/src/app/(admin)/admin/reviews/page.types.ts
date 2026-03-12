import type { AdminReview } from '@/lib/hooks/useReviews';


export interface ReviewRowProps {
  review: AdminReview;
  onDelete: (id: string) => void;
}

export interface ReviewsTableProps {
  reviews: AdminReview[];
  onDelete: (id: string) => void;
}

export interface ReviewsPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}
