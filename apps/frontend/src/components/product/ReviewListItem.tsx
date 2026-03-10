import { Pencil, Trash2 } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { getInitials } from '@/lib/utils';
import type { ReviewListItemProps } from './ReviewListItem.types';
import { s } from './ReviewList.styled';

export const ReviewListItem = ({
  review,
  isOwn,
  onEdit,
  onDelete,
  onImageClick,
}: ReviewListItemProps) => {
  const initials = getInitials(review.user.name, undefined);
  const date = new Date(review.createdAt).toLocaleDateString('ru-RU');

  return (
    <div className={s.card}>
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
              onClick={() => onImageClick(url)}
            />
          ))}
        </div>
      </When>
    </div>
  );
};
