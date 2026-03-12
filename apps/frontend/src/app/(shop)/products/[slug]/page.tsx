'use client';

import { use } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Spinner } from '@/components/ui/Spinner';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductReviews } from './ProductReviews';
import { SimilarProducts } from './SimilarProducts';
import { RecentlyViewed } from './RecentlyViewed';
import { useTrackProductView } from './useTrackProductView';
import { useProduct } from '@/lib/hooks/useProducts';
import { s } from './page.styled';
import type { Props } from './page.types';


const ProductPage = (props: Props) => {
  const { slug } = use(props.params);
  const { data: product, isLoading, isError } = useProduct(slug);
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
          <p className={s.errorTitle}>Товар не найден</p>
          <p className={s.errorText}>Возможно, он был удалён или ссылка неверна</p>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Каталог', href: '/products' },
    { label: product.category.name, href: `/products?categorySlug=${product.category.slug}` },
    { label: product.name },
  ];

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.layout}>
        <ProductGallery images={product.images} name={product.name} />
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

export default ProductPage;
