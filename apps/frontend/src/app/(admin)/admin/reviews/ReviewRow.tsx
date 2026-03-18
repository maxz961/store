'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { getInitials, langToLocale } from '@/lib/utils';
import type { ReviewRowProps } from './page.types';


export const ReviewRow = ({ review, onDelete }: ReviewRowProps) => {
  const { lang } = useLanguage();
  const handleDelete = () => onDelete(review.id);

  const dateStr = new Date(review.createdAt).toLocaleDateString(langToLocale(lang));

  const avatar = (
    <If condition={!!review.user.image}>
      <Then>
        <Image
          src={review.user.image ?? ''}
          alt={review.user.name ?? ''}
          width={28}
          height={28}
          className={s.avatar}
          unoptimized
        />
      </Then>
      <Else>
        <div className={s.avatarFallback}>
          {getInitials(review.user.name, review.user.name ?? '')}
        </div>
      </Else>
    </If>
  );

  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
    />
  ));

  return (
    <tr className={s.tr}>
      <td className={s.td}>
        <div className={s.userCell}>
          {avatar}
          <span className={s.userName}>{review.user.name ?? '—'}</span>
        </div>
      </td>
      <td className={s.td}>
        <Link href={`/products/${review.product.slug}?reviews=open`} className={s.productLink} prefetch={false}>
          {review.product.name}
        </Link>
      </td>
      <td className={s.tdCenter}>
        <div className={s.stars}>{stars}</div>
      </td>
      <td className={s.td}>
        <If condition={!!review.comment}>
          <Then>
            <p className={s.comment}>{review.comment}</p>
          </Then>
          <Else>
            <span className={s.noComment}>Без комментария</span>
          </Else>
        </If>
      </td>
      <td className={s.tdCenter}>
        <When condition={!!review.adminReply}>
          <span className={s.replyBadge}>Есть ответ</span>
        </When>
      </td>
      <td className={s.td}>
        <span className={s.date}>{dateStr}</span>
      </td>
      <td className={s.td}>
        <button type="button" className={s.deleteBtn} onClick={handleDelete}>
          Удалить
        </button>
      </td>
    </tr>
  );
};
