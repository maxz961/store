import Link from 'next/link';
import Image from 'next/image';
import { When } from 'react-if';
import { s } from './PromoBanner.styled';
import type { PromoBannerSlideProps } from './PromoBanner.types';


const formatDiscount = (type: 'PERCENTAGE' | 'FIXED', value: number) =>
  type === 'PERCENTAGE' ? `-${value}%` : `-$${value}`;


export const PromoBannerSlide = ({
  title,
  description,
  bannerImageUrl,
  bannerBgColor,
  discountType,
  discountValue,
  link,
}: PromoBannerSlideProps) => (
  <div
    className={s.slide}
    style={{ backgroundColor: bannerBgColor ?? '#f1f5f9', minHeight: 140 }}
  >
    <div className={s.slideLeft}>
      <span className={s.slideDiscount}>
        {formatDiscount(discountType, discountValue)}
      </span>
      <h3 className={s.slideTitle}>{title}</h3>
      <When condition={!!description}>
        <p className={s.slideDescription}>{description}</p>
      </When>
      <When condition={!!link}>
        <Link href={link ?? '#'} className={s.slideLink}>
          Подробнее
        </Link>
      </When>
    </div>

    <div className={s.slideRight}>
      <Image
        src={bannerImageUrl}
        alt={title}
        width={240}
        height={120}
        className={s.slideImage}
        unoptimized
      />
    </div>
  </div>
);
