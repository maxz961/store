import Image from 'next/image';
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

  const handleEdit = () => onEdit?.(review);

  const handleDelete = () => onDelete?.(review.id);

  const handleImageClick = (url: string) => () => onImageClick(url);

  return (
    <div className={s.card}>
      <div className={s.header}>
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

        <When condition={isOwn}>
          <div className={s.ownActions}>
            <When condition={!!onEdit}>
              <Button
                variant="ghost"
                size="icon"
                className={s.buttonIcon}
                onClick={handleEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </When>
            <When condition={!!onDelete}>
              <Button
                variant="ghost"
                size="icon"
                className={s.buttonIconDestructive}
                onClick={handleDelete}
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
    </div>
  );
};
