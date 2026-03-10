import { Trash2, MessageSquare, Pencil } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { getInitials } from '@/lib/utils';
import type { ReviewCardProps } from './ReviewCard.types';
import { s } from './ReviewModal.styled';

export const ReviewCard = ({
  review,
  isOwn,
  isAdmin,
  replyingTo,
  replyText,
  onEditReview,
  onDeleteOwn,
  onAdminDelete,
  onStartReply,
  onSubmitReply,
  onCancelReply,
  onDeleteReply,
  onReplyTextChange,
  onImageClick,
}: ReviewCardProps) => {
  const initials = getInitials(review.user.name, undefined);
  const date = new Date(review.createdAt).toLocaleDateString('ru-RU');

  return (
    <div className={s.card}>
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
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEditReview}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDeleteOwn(review.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </When>

        {/* Admin actions (on other users' reviews) */}
        <When condition={isAdmin && !isOwn}>
          <div className={s.adminActions}>
            <When condition={!review.adminReply}>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onStartReply(review.id)}>
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </When>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onAdminDelete(review.id)}
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
              onClick={() => onImageClick(url)}
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
                onClick={() => onDeleteReply(review.id)}
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
            onChange={(e) => onReplyTextChange(e.target.value)}
            maxLength={2000}
          />
          <div className={s.replyActions}>
            <Button size="sm" onClick={() => onSubmitReply(review.id)} disabled={!replyText.trim()}>
              Ответить
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancelReply}>
              Отмена
            </Button>
          </div>
        </div>
      </When>
    </div>
  );
};
