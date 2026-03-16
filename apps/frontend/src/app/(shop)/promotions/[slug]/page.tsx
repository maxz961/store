'use client';

import { useParams } from 'next/navigation';
import { If, Then, Else, When } from 'react-if';
import { ProductCard } from '@/components/product/ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import { usePublicPromotion } from '@/lib/hooks/usePromotions';
import { s } from './page.styled';


const formatDiscount = (type: 'PERCENTAGE' | 'FIXED', value: number) =>
  type === 'PERCENTAGE' ? `-${value}%` : `-$${value}`;


export default function PromotionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: promotion, isLoading } = usePublicPromotion(slug);

  return (
    <div className={s.page}>
      <If condition={isLoading}>
        <Then>
          <div className={s.loading}>
            <Spinner />
          </div>
        </Then>
        <Else>
          <When condition={!!promotion}>
            <div
              className={s.header}
              style={{ backgroundColor: promotion?.bannerBgColor ?? '#f1f5f9' }}
            >
              <span className={s.headerDiscount} style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
                {promotion && formatDiscount(promotion.discountType, promotion.discountValue)}
              </span>
              <h1 className={s.headerTitle}>{promotion?.title}</h1>
              <When condition={!!promotion?.description}>
                <p className={s.headerDescription}>{promotion?.description}</p>
              </When>
            </div>

            <If condition={(promotion?.products.length ?? 0) === 0}>
              <Then>
                <div className={s.empty}>
                  <p className={s.emptyTitle}>Товары не найдены</p>
                  <p className={s.emptyText}>В этой акции пока нет товаров</p>
                </div>
              </Then>
              <Else>
                <div className={s.grid}>
                  {promotion?.products.map(({ product }) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </Else>
            </If>
          </When>
        </Else>
      </If>
    </div>
  );
}
