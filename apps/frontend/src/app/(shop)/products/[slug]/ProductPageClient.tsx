'use client';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Spinner } from '@/components/ui/Spinner';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductReviews } from './ProductReviews';
import { SimilarProducts } from './SimilarProducts';
import { RecentlyViewed } from './RecentlyViewed';
import { useTrackProductView } from './useTrackProductView';
import { useProduct } from '@/lib/hooks/useProducts';
import { useLanguage } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import { s } from './page.styled';


interface Props {
  slug: string;
}


export const ProductPageClient = ({ slug }: Props) => {
  const { data: product, isLoading, isError } = useProduct(slug);
  const { t, lang } = useLanguage();
  useTrackProductView(product);

  if (isLoading) {
    return (
      <div className={s.page}>
        <Spinner />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={s.page}>
        <div className={s.error}>
          <p className={s.errorTitle}>{t('product.notFound')}</p>
          <p className={s.errorText}>{t('product.notFoundText')}</p>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t('catalog.title'), href: '/products' },
    { label: getLocalizedText(lang, product.category.name, product.category.nameEn), href: `/products?categorySlug=${product.category.slug}` },
    { label: getLocalizedText(lang, product.name, product.nameEn) },
  ];

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.layout}>
        <ProductGallery productId={product.id} images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <ProductReviews
        productId={product.id}
        productSlug={slug}
        reviews={product.reviews}
      />

      <SimilarProducts slug={slug} />
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
};
