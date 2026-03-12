'use client';

import { ProductCarousel } from '@/components/product/ProductCarousel';
import { useSimilarProducts } from '@/lib/hooks/useProducts';
import type { SimilarProductsProps } from './page.types';


export const SimilarProducts = ({ slug }: SimilarProductsProps) => {
  const { data: products = [], isLoading } = useSimilarProducts(slug);

  if (isLoading || products.length === 0) return null;

  return <ProductCarousel title="Похожие товары" products={products} />;
};
