'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { ReviewForm } from '@/components/review/ReviewForm';
import { ReviewCard } from '@/components/review/ReviewCard';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  useProductReviews,
  useMyReview,
  useDeleteReview,
  useAdminDeleteReview,
  useAdminReply,
  useAdminDeleteReply,
  type ReviewSort,
} from '@/lib/hooks/useReviews';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import type { ReviewModalProps } from './ReviewModal.types';
import { SORT_OPTIONS } from './ReviewModal.constants';
import { s } from './ReviewModal.styled';


export const ReviewModal = ({ productId, productSlug, onClose }: ReviewModalProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sort, setSort] = useState<ReviewSort>('newest');
  const [page, setPage] = useState(1);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data: reviewsData } = useProductReviews(productId, sort, page);
  const reviews = useMemo(() => reviewsData?.data ?? [], [reviewsData]);
  const total = reviewsData?.total ?? 0;
  const totalPages = reviewsData?.totalPages ?? 1;

  const { data: myReview } = useMyReview(productId, !!user);
  const deleteReview = useDeleteReview(productSlug);
  const adminDeleteReview = useAdminDeleteReview(productSlug);
  const adminReply = useAdminReply(productSlug);
  const adminDeleteReply = useAdminDeleteReply(productSlug);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxUrl) setLightboxUrl(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose, lightboxUrl]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const handleSort = useCallback((value: ReviewSort) => () => {
    setSort(value);
    setPage(1);
  }, []);

  const handlePrevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const handleNextPage = useCallback(() => setPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

  const handleDeleteReview = useCallback((reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (review && user?.id === review.userId) {
      deleteReview.mutate({ reviewId, productId });
    } else {
      adminDeleteReview.mutate({ reviewId, productId });
    }
  }, [reviews, user, deleteReview, adminDeleteReview, productId]);

  const handleReply = useCallback((reviewId: string, text: string) => {
    adminReply.mutate({ reviewId, reply: text });
  }, [adminReply]);

  const handleDeleteReply = useCallback((reviewId: string) => {
    adminDeleteReply.mutate({ reviewId, productId });
  }, [adminDeleteReply, productId]);

  const handleShowForm = useCallback(() => setShowForm(true), []);
  const handleCancelForm = useCallback(() => setShowForm(false), []);
  const handleEditReview = useCallback(() => setEditingReview(true), []);
  const handleFormSuccess = useCallback(() => {
    setEditingReview(false);
    setShowForm(false);
  }, []);

  const closeLightbox = useCallback(() => setLightboxUrl(null), []);

  return (
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.modal}>
        {/* Header */}
        <div className={s.header}>
          <h2 className={s.title}>{t('product.reviews')} ({total})</h2>
          <button className={s.closeButton} onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sort toolbar */}
        <When condition={total > 1}>
          <div className={s.toolbar}>
            <div className={s.sortGroup}>
              <span className={s.sortLabel}>{t('review.sortLabel')}</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={cn(s.sortButton, sort === opt.value ? s.sortActive : s.sortInactive)}
                  onClick={handleSort(opt.value)}
                >
                  {t(opt.labelKey as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>
        </When>

        {/* Reviews list */}
        <div className={s.content}>
          <If condition={reviews.length === 0}>
            <Then>
              <p className={s.empty}>{t('review.empty')}</p>
            </Then>
            <Else>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onImageClick={setLightboxUrl}
                  onEditReview={handleEditReview}
                  onDeleteReview={handleDeleteReview}
                  onReply={handleReply}
                  onDeleteReply={handleDeleteReply}
                />
              ))}
            </Else>
          </If>
        </div>

        {/* Pagination */}
        <When condition={totalPages > 1}>
          <div className={s.pagination}>
            <button
              className={s.pageButton}
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className={s.pageInfo}>{page} / {totalPages}</span>
            <button
              className={s.pageButton}
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </When>

        {/* Review form / CTA at the bottom */}
        <div className={s.formSection}>
          <If condition={editingReview || (showForm && !myReview)}>
            <Then>
              <div className={s.formHeader}>
                <span className={s.formTitle}>{t('product.writeReview')}</span>
                <When condition={!editingReview}>
                  <button type="button" className={s.formCloseBtn} onClick={handleCancelForm}>
                    <X className="h-4 w-4" />
                  </button>
                </When>
              </div>
              <ReviewForm
                productId={productId}
                productSlug={productSlug}
                existingReview={editingReview ? myReview : undefined}
                onSuccess={handleFormSuccess}
              />
            </Then>
            <Else>
              <When condition={!myReview}>
                <button type="button" className={s.writeReviewBtn} onClick={handleShowForm}>
                  {t('product.writeReview')}
                </button>
              </When>
            </Else>
          </If>
        </div>
      </div>

      {/* Lightbox */}
      <When condition={!!lightboxUrl}>
        <div className={s.lightbox} onClick={closeLightbox}>
          <button className={s.lightboxClose} onClick={closeLightbox}>
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxUrl ?? ''} alt="" className={s.lightboxImage} />
        </div>
      </When>
    </div>
  );
};
