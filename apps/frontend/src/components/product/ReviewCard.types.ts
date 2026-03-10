import type { Review } from '@/lib/hooks/useReviews';

export interface ReviewCardProps {
  review: Review;
  isOwn: boolean;
  isAdmin: boolean;
  replyingTo: string | null;
  replyText: string;
  onEditReview: () => void;
  onDeleteOwn: (reviewId: string) => void;
  onAdminDelete: (reviewId: string) => void;
  onStartReply: (reviewId: string) => void;
  onSubmitReply: (reviewId: string) => void;
  onCancelReply: () => void;
  onDeleteReply: (reviewId: string) => void;
  onReplyTextChange: (text: string) => void;
  onImageClick: (url: string) => void;
}
