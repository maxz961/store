'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewModal } from '@/components/review/ReviewModal';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { ProductReviewsProps } from './page.types';


export const ProductReviews = ({ productId, productSlug, reviews }: ProductReviewsProps) => {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(() => searchParams.get('reviews') === 'open');

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleOpen = useCallback(() => setShowModal(true), []);
  const handleClose = useCallback(() => setShowModal(false), []);

  return (
    <>
      <div className={s.reviewsSection}>
        <div className={s.reviewsSummary}>
          <div className={s.reviewsSummaryLeft}>
            <h2 className={s.reviewsTitle}>{t('product.reviews')}</h2>
            <When condition={reviews.length > 0}>
              <div className={s.reviewsSummaryRating}>
                <StarRating value={Math.round(avgRating)} size="sm" />
                <span className={s.reviewsSummaryText}>
                  {avgRating.toFixed(1)} · {reviews.length}{' '}
                  {reviews.length === 1 ? t('product.reviewsOne') : reviews.length < 5 ? t('product.reviewsFew') : t('product.reviewsMany')}
                </span>
              </div>
            </When>
          </div>
          <Button variant="outline" onClick={handleOpen}>
            <MessageSquare className={s.buttonIcon} />
            {reviews.length > 0 ? t('product.showAllReviews') : t('product.writeReview')}
          </Button>
        </div>
      </div>

      <When condition={showModal}>
        <ReviewModal
          productId={productId}
          productSlug={productSlug}
          onClose={handleClose}
        />
      </When>
    </>
  );
};
