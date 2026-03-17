'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, MessageSquare, Pencil } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { getInitials, langToLocale } from '@/lib/utils';
import type { ReviewCardProps } from './ReviewCard.types';
import { s } from '../ReviewModal/ReviewModal.styled';


export const ReviewCard = ({
  review,
  onImageClick,
  onEditReview,
  onDeleteReview,
  onReply,
  onDeleteReply,
}: ReviewCardProps) => {
  const { user, isAdmin } = useAuth();
  const { lang } = useLanguage();
  const isOwn = user?.id === review.userId;

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const initials = getInitials(review.user.name, undefined);
  const date = new Date(review.createdAt).toLocaleDateString(langToLocale(lang));

  const handleDelete = useCallback(() => onDeleteReview?.(review.id), [onDeleteReview, review.id]);
  const handleImageClick = useCallback((url: string) => () => onImageClick(url), [onImageClick]);
  const handleDeleteReply = useCallback(() => onDeleteReply?.(review.id), [onDeleteReply, review.id]);

  const handleStartReply = useCallback(() => {
    setIsReplying(true);
    setReplyText('');
  }, []);

  const handleCancelReply = useCallback(() => {
    setIsReplying(false);
    setReplyText('');
  }, []);

  const handleReplyTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  }, []);

  const handleSubmitReply = useCallback(() => {
    if (!replyText.trim()) return;
    onReply?.(review.id, replyText.trim());
    setIsReplying(false);
    setReplyText('');
  }, [onReply, review.id, replyText]);

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <If condition={!!review.user.image}>
          <Then>
            <Image
              src={review.user.image ?? ''}
              alt=""
              width={40}
              height={40}
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
            <Button variant="ghost" size="icon" className={s.buttonIcon} onClick={onEditReview}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={s.buttonIconDestructive}
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </When>

        {/* Admin actions (on other users' reviews) */}
        <When condition={isAdmin && !isOwn}>
          <div className={s.adminActions}>
            <When condition={!review.adminReply}>
              <Button variant="ghost" size="icon" className={s.buttonIcon} onClick={handleStartReply}>
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </When>
            <Button
              variant="ghost"
              size="icon"
              className={s.buttonIconDestructive}
              onClick={handleDelete}
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
            <Image
              key={url}
              src={url}
              alt=""
              width={80}
              height={80}
              className={s.imageThumb}
              onClick={handleImageClick(url)}
              unoptimized
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
                className={s.buttonIconSmDestructive}
                onClick={handleDeleteReply}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </When>
          </div>
          <p className={s.adminReplyText}>{review.adminReply}</p>
          <When condition={!!review.adminReplyAt}>
            <p className={s.adminReplyDate}>
              {new Date(review.adminReplyAt!).toLocaleDateString(langToLocale(lang))}
            </p>
          </When>
        </div>
      </When>

      {/* Admin reply form */}
      <When condition={isReplying}>
        <div className={s.replyForm}>
          <textarea
            className={s.replyTextarea}
            rows={2}
            placeholder="Ответ от имени магазина..."
            value={replyText}
            onChange={handleReplyTextChange}
            maxLength={2000}
          />
          <div className={s.replyActions}>
            <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim()}>
              Ответить
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelReply}>
              Отмена
            </Button>
          </div>
        </div>
      </When>
    </div>
  );
};
