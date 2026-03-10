'use client';

import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { When } from 'react-if';
import { ReviewListItem } from '@/components/product/ReviewListItem';
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
        {reviews.map((review) => (
          <ReviewListItem
            key={review.id}
            review={review}
            isOwn={currentUserId === review.userId}
            onEdit={onEdit}
            onDelete={onDelete}
            onImageClick={setLightboxUrl}
          />
        ))}
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
