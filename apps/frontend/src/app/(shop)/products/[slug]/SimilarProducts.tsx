'use client';

import { ProductCarousel } from '@/components/product/ProductCarousel';
import { useSimilarProducts } from '@/lib/hooks/useProducts';
import { useLanguage } from '@/lib/i18n';
import type { SimilarProductsProps } from './page.types';


export const SimilarProducts = ({ slug }: SimilarProductsProps) => {
  const { data: products = [], isLoading } = useSimilarProducts(slug);
  const { t } = useLanguage();

  if (isLoading || products.length === 0) return null;

  return <ProductCarousel title={t('product.similar')} products={products} />;
};
