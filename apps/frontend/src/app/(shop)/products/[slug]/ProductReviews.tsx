import { MessageSquare } from 'lucide-react';
import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewModal } from '@/components/product/ReviewModal';
import { s } from './page.styled';
import type { ProductReviewsProps } from './page.types';


export const ProductReviews = ({
  productId,
  productSlug,
  reviews,
  avgRating,
  showReviewModal,
  onOpenReviewModal,
  onCloseReviewModal,
}: ProductReviewsProps) => {
  return (
    <>
      <div className={s.reviewsSection}>
        <div className={s.reviewsSummary}>
          <div className={s.reviewsSummaryLeft}>
            <h2 className={s.reviewsTitle}>Отзывы</h2>
            <When condition={reviews.length > 0}>
              <div className={s.reviewsSummaryRating}>
                <StarRating value={Math.round(avgRating)} size="sm" />
                <span className={s.reviewsSummaryText}>
                  {avgRating.toFixed(1)} · {reviews.length}{' '}
                  {reviews.length === 1 ? 'отзыв' : reviews.length < 5 ? 'отзыва' : 'отзывов'}
                </span>
              </div>
            </When>
          </div>
          <Button
            variant="outline"
            onClick={onOpenReviewModal}
          >
            <MessageSquare className={s.buttonIcon} />
            {reviews.length > 0 ? 'Показать все' : 'Оставить отзыв'}
          </Button>
        </div>
      </div>

      <When condition={showReviewModal}>
        <ReviewModal
          productId={productId}
          productSlug={productSlug}
          onClose={onCloseReviewModal}
        />
      </When>
    </>
  );
};
