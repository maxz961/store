import { useEffect } from 'react';
import { useRecentlyViewedStore } from '@/store/recentlyViewed';
import type { ProductInfoProps } from './page.types';


type TrackableProduct = ProductInfoProps['product'];

export const useTrackProductView = (product: TrackableProduct | undefined) => {
  const addItem = useRecentlyViewedStore((s) => s.addItem);

  useEffect(() => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images,
      stock: product.stock,
      category: product.category,
      tags: product.tags,
      reviews: product.reviews,
    });
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps
};
