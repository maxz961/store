'use client';

import { useParams } from 'next/navigation';
import { If, Then, Else, When } from 'react-if';
import { ProductCard } from '@/components/product/ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { usePublicPromotion } from '@/lib/hooks/usePromotions';
import { useLanguage } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import { s } from './page.styled';


const formatDiscount = (type: 'PERCENTAGE' | 'FIXED', value: number) =>
  type === 'PERCENTAGE' ? `-${value}%` : `-$${value}`;


export default function PromotionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: promotion, isLoading } = usePublicPromotion(slug);
  const { t, lang } = useLanguage();

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: promotion ? getLocalizedText(lang, promotion.title, promotion.titleEn) : '...' },
  ];

  return (
    <div className={s.page}>
      <div className={s.breadcrumbs}>
        <Breadcrumbs items={breadcrumbs} />
      </div>

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
              <h1 className={s.headerTitle}>
                {promotion && getLocalizedText(lang, promotion.title, promotion.titleEn)}
              </h1>
              <When condition={!!promotion?.description}>
                <p className={s.headerDescription}>
                  {promotion && getLocalizedText(lang, promotion.description ?? '', promotion.descriptionEn)}
                </p>
              </When>
            </div>

            <If condition={(promotion?.products.length ?? 0) === 0}>
              <Then>
                <div className={s.empty}>
                  <p className={s.emptyTitle}>{t('promotions.noProducts')}</p>
                  <p className={s.emptyText}>{t('promotions.noProductsText')}</p>
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
