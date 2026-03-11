import Link from 'next/link';
import Image from 'next/image';
import { If, Then, Else } from 'react-if';
import { s } from './page.styled';
import { DISCOUNT_TYPE_LABELS } from './page.constants';
import type { PromotionRowProps } from './page.types';


const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

export const PromotionRow = ({ promotion }: PromotionRowProps) => (
  <tr className={s.tr}>
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
        <Then><span className={s.statusActive}>Активна</span></Then>
        <Else><span className={s.statusInactive}>Неактивна</span></Else>
      </If>
    </td>
    <td className={s.tdCenter}>
      <span className={s.position}>{promotion.position}</span>
    </td>
    <td className={s.td}>
      <Link href={`/admin/promotions/${promotion.id}`} className={s.editLink}>
        Редактировать
      </Link>
    </td>
  </tr>
);
