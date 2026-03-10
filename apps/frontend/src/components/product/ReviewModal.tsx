'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, Trash2, MessageSquare, Pencil } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewForm } from '@/components/product/ReviewForm';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  useProductReviews,
  useMyReview,
  useDeleteReview,
  useAdminDeleteReview,
  useAdminReply,
  useAdminDeleteReply,
  type Review,
  type ReviewSort,
} from '@/lib/hooks/useReviews';
import { cn } from '@/lib/utils';
import { s } from './ReviewModal.styled';


interface ReviewModalProps {
  productId: string;
  productSlug: string;
  onClose: () => void;
}

const SORT_OPTIONS: { value: ReviewSort; label: string }[] = [
  { value: 'newest', label: 'Новые' },
  { value: 'oldest', label: 'Старые' },
  { value: 'highest', label: 'Высокий рейтинг' },
  { value: 'lowest', label: 'Низкий рейтинг' },
];

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
              {reviews.map((review) => {
                const isOwn = user?.id === review.userId;
                const initials = getInitials(review.user.name, undefined);
                const date = new Date(review.createdAt).toLocaleDateString('ru-RU');

                return (
                  <div key={review.id} className={s.card}>
                    <div className={s.cardHeader}>
                      <If condition={!!review.user.image}>
                        <Then>
                          <img
                            src={review.user.image ?? ''}
                            alt=""
                            className={s.avatar}
                            referrerPolicy="no-referrer"
                          />
                        </Then>
                        <Else>
                          <span className={s.avatarFallback}>{initials}</span>
                        </Else>
                      </If>

                      <div className={s.authorInfo}>
                        <p className={s.authorName}>{review.user.name ?? 'Аноним'}</p>
                        <p className={s.date}>{date}</p>
                      </div>

                      <div className={s.stars}>
                        <StarRating value={review.rating} size="sm" />
                      </div>

                      {/* Own review actions */}
                      <When condition={isOwn}>
                        <div className={s.ownActions}>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleEditReview}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteOwn(review.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </When>

                      {/* Admin actions (on other users' reviews) */}
                      <When condition={isAdmin && !isOwn}>
                        <div className={s.adminActions}>
                          <When condition={!review.adminReply}>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStartReply(review.id)}>
                              <MessageSquare className="h-3.5 w-3.5" />
                            </Button>
                          </When>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleAdminDelete(review.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </When>
                    </div>

                    <When condition={!!review.comment}>
                      <p className={s.comment}>{review.comment}</p>
                    </When>

                    <When condition={review.images.length > 0}>
                      <div className={s.images}>
                        {review.images.map((url) => (
                          <img
                            key={url}
                            src={url}
                            alt=""
                            className={s.imageThumb}
                            onClick={() => setLightboxUrl(url)}
                          />
                        ))}
                      </div>
                    </When>

                    {/* Admin reply display */}
                    <When condition={!!review.adminReply}>
                      <div className={s.adminReply}>
                        <div className={s.adminReplyHeader}>
                          <span className={s.adminReplyLabel}>Ответ магазина</span>
                          <When condition={isAdmin}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteReply(review.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </When>
                        </div>
                        <p className={s.adminReplyText}>{review.adminReply}</p>
                        <When condition={!!review.adminReplyAt}>
                          <p className={s.adminReplyDate}>
                            {new Date(review.adminReplyAt!).toLocaleDateString('ru-RU')}
                          </p>
                        </When>
                      </div>
                    </When>

                    {/* Admin reply form */}
                    <When condition={replyingTo === review.id}>
                      <div className={s.replyForm}>
                        <textarea
                          className={s.replyTextarea}
                          rows={2}
                          placeholder="Ответ от имени магазина..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          maxLength={2000}
                        />
                        <div className={s.replyActions}>
                          <Button size="sm" onClick={() => handleSubmitReply(review.id)} disabled={!replyText.trim()}>
                            Ответить
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelReply}>
                            Отмена
                          </Button>
                        </div>
                      </div>
                    </When>
                  </div>
                );
              })}
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
