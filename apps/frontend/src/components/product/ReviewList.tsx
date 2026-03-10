'use client';

import { useState, useCallback } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { getInitials } from '@/lib/utils';
import type { ReviewListProps } from './ReviewList.types';
import { s } from './ReviewList.styled';

export const ReviewList = ({ reviews, currentUserId, onEdit, onDelete }: ReviewListProps) => {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const closeLightbox = useCallback(() => setLightboxUrl(null), []);

  if (reviews.length === 0) {
    return <p className={s.empty}>Пока нет отзывов</p>;
  }

  return (
    <>
      <div className={s.list}>
        {reviews.map((review) => {
          const isOwn = currentUserId === review.userId;
          const initials = getInitials(review.user.name, undefined);
          const date = new Date(review.createdAt).toLocaleDateString('ru-RU');

          return (
            <div key={review.id} className={s.card}>
              <div className={s.header}>
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

                <When condition={isOwn}>
                  <div className={s.ownActions}>
                    <When condition={!!onEdit}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onEdit?.(review)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </When>
                    <When condition={!!onDelete}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => onDelete?.(review.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </When>
                  </div>
                </When>
              </div>

              <div className={s.stars}>
                <StarRating value={review.rating} size="sm" />
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
            </div>
          );
        })}
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
    </>
  );
};
