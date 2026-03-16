'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { If, Then, Else } from 'react-if';
import { s } from './page.styled';
import { DISCOUNT_TYPE_LABELS } from './page.constants';
import type { PromotionRowProps } from './page.types';


const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });


export const PromotionRow = ({ promotion }: PromotionRowProps) => {
  const router = useRouter();

  const handleRowClick = useCallback(() => {
    router.push(promotion.link ?? '/products');
  }, [router, promotion.link]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <tr className={s.tr} onClick={handleRowClick}>
      <td className={s.td}>
        <div className={s.bannerCell}>
          <Image
            src={promotion.bannerImageUrl}
            alt={promotion.title}
            width={80}
            height={40}
            className={s.bannerThumb}
            unoptimized
          />
          <span className={s.promoTitle}>{promotion.title}</span>
        </div>
      </td>
      <td className={s.td}>
        <span className={s.period}>
          {formatDate(promotion.startDate)} — {formatDate(promotion.endDate)}
        </span>
      </td>
      <td className={s.td}>
        <span className={s.discount}>
          {promotion.discountValue}{DISCOUNT_TYPE_LABELS[promotion.discountType]}
        </span>
      </td>
      <td className={s.tdCenter}>
        <If condition={promotion.isActive}>
          <Then><span className={s.statusActive}>Active</span></Then>
          <Else><span className={s.statusInactive}>Inactive</span></Else>
        </If>
      </td>
      <td className={s.tdCenter}>
        <span className={s.position}>{promotion.position}</span>
      </td>
      <td className={s.td}>
        <Link href={`/admin/promotions/${promotion.id}`} className={s.editLink} onClick={handleEditClick}>
          <Pencil className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
};
