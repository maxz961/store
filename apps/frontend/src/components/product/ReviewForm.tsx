'use client';

import { useState } from 'react';
import Link from 'next/link';
import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/StarRating';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  useCreateReview,
  useUpdateReview,
  useUploadReviewImages,
} from '@/lib/hooks/useReviews';
import type { ReviewFormProps } from './ReviewForm.types';
import { s } from './ReviewForm.styled';


export const ReviewForm = ({ productId, productSlug, existingReview, onSuccess }: ReviewFormProps) => {
  const { isAuthenticated } = useAuth();
  const createReview = useCreateReview(productSlug);
  const updateReview = useUpdateReview(productSlug);
  const uploadImages = useUploadReviewImages();

  const isEditing = !!existingReview;

  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? '');
  const [files, setFiles] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>(existingReview?.images ?? []);
  const [ratingError, setRatingError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const isSubmitting = createReview.isPending || updateReview.isPending || uploadImages.isPending;

  if (!isAuthenticated) {
    return (
      <div className={s.notAuth}>
        <p className={s.notAuthText}>
          <Link href="/login" className="text-primary hover:underline">Войдите</Link>
          {' '}чтобы оставить отзыв
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRatingError('');
    setSubmitError('');

    if (rating === 0) {
      setRatingError('Выберите оценку');
      return;
    }

    try {
      let imageUrls = [...existingUrls];

      if (files.length > 0) {
        const uploaded = await uploadImages.mutateAsync(files);
        imageUrls = [...imageUrls, ...uploaded.urls];
      }

      const data = {
        rating,
        comment: comment.trim() || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      if (isEditing && existingReview) {
        await updateReview.mutateAsync({ reviewId: existingReview.id, data });
      } else {
        await createReview.mutateAsync({ productId, data });
      }

      if (!isEditing) {
        setRating(0);
        setComment('');
        setFiles([]);
        setExistingUrls([]);
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось отправить отзыв');
    }
  };

  const handleRemoveExisting = (url: string) => {
    setExistingUrls((prev) => prev.filter((u) => u !== url));
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <p className={s.title}>{isEditing ? 'Редактировать отзыв' : 'Оставить отзыв'}</p>

      <When condition={!!submitError}>
        <div className={s.error}>{submitError}</div>
      </When>

      <div className={s.ratingField}>
        <p className={s.ratingLabel}>Оценка</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
        <When condition={!!ratingError}>
          <p className={s.ratingError}>{ratingError}</p>
        </When>
      </div>

      <div className={s.commentField}>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Расскажите о товаре..."
          maxLength={2000}
          rows={3}
        />
      </div>

      <div className={s.imagesField}>
        <p className={s.imagesLabel}>Фото (необязательно)</p>
        <ImageUpload
          files={files}
          existingUrls={existingUrls}
          onChange={setFiles}
          onRemoveExisting={handleRemoveExisting}
          maxFiles={5}
        />
      </div>

      <div className={s.actions}>
        <Button type="submit" disabled={isSubmitting} className={s.submitButton}>
          {isSubmitting ? 'Отправка...' : isEditing ? 'Сохранить' : 'Оставить отзыв'}
        </Button>
      </div>
    </form>
  );
};
