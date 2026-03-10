'use client';

import { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { ReviewForm } from '@/components/product/ReviewForm';
import { ReviewCard } from '@/components/product/ReviewCard';
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
import type { ReviewModalProps } from './ReviewModal.types';
import { SORT_OPTIONS } from './ReviewModal.constants';
import { s } from './ReviewModal.styled';

export const ReviewModal = ({ productId, productSlug, onClose }: ReviewModalProps) => {
  const { user, isAdmin } = useAuth();
  const [sort, setSort] = useState<ReviewSort>('newest');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReview, setEditingReview] = useState(false);

  const { data: reviews = [] } = useProductReviews(productId, sort);
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

  const handleSort = useCallback((value: ReviewSort) => () => setSort(value), []);

  const handleDeleteOwn = useCallback((reviewId: string) => {
    deleteReview.mutate({ reviewId, productId });
  }, [deleteReview, productId]);

  const handleAdminDelete = useCallback((reviewId: string) => {
    adminDeleteReview.mutate({ reviewId, productId });
  }, [adminDeleteReview, productId]);

  const handleStartReply = useCallback((reviewId: string) => {
    setReplyingTo(reviewId);
    setReplyText('');
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyText('');
  }, []);

  const handleSubmitReply = useCallback((reviewId: string) => {
    if (!replyText.trim()) return;
    adminReply.mutate({ reviewId, reply: replyText.trim() });
    setReplyingTo(null);
    setReplyText('');
  }, [adminReply, replyText]);

  const handleDeleteReply = useCallback((reviewId: string) => {
    adminDeleteReply.mutate({ reviewId, productId });
  }, [adminDeleteReply, productId]);

  const handleEditReview = useCallback(() => setEditingReview(true), []);
  const handleFormSuccess = useCallback(() => setEditingReview(false), []);

  const closeLightbox = useCallback(() => setLightboxUrl(null), []);

  return (
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.modal}>
        {/* Header */}
        <div className={s.header}>
          <h2 className={s.title}>Отзывы ({reviews.length})</h2>
          <button className={s.closeButton} onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sort toolbar */}
        <When condition={reviews.length > 1}>
          <div className={s.toolbar}>
            <div className={s.sortGroup}>
              <span className={s.sortLabel}>Сортировка:</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={cn(s.sortButton, sort === opt.value ? s.sortActive : s.sortInactive)}
                  onClick={handleSort(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </When>

        {/* Reviews list */}
        <div className={s.content}>
          <If condition={reviews.length === 0}>
            <Then>
              <p className={s.empty}>Пока нет отзывов. Будьте первым!</p>
            </Then>
            <Else>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwn={user?.id === review.userId}
                  isAdmin={isAdmin}
                  replyingTo={replyingTo}
                  replyText={replyText}
                  onEditReview={handleEditReview}
                  onDeleteOwn={handleDeleteOwn}
                  onAdminDelete={handleAdminDelete}
                  onStartReply={handleStartReply}
                  onSubmitReply={handleSubmitReply}
                  onCancelReply={handleCancelReply}
                  onDeleteReply={handleDeleteReply}
                  onReplyTextChange={setReplyText}
                  onImageClick={setLightboxUrl}
                />
              ))}
            </Else>
          </If>
        </div>

        {/* Review form at the bottom */}
        <div className={s.formSection}>
          <When condition={!myReview || editingReview}>
            <ReviewForm
              productId={productId}
              productSlug={productSlug}
              existingReview={editingReview ? myReview : undefined}
              onSuccess={handleFormSuccess}
            />
          </When>
        </div>
      </div>

      {/* Lightbox */}
      <When condition={!!lightboxUrl}>
        <div className={s.lightbox} onClick={closeLightbox}>
          <button className={s.lightboxClose} onClick={closeLightbox}>
            <X className="h-5 w-5" />
          </button>
          <img src={lightboxUrl ?? ''} alt="" className={s.lightboxImage} />
        </div>
      </When>
    </div>
  );
};
