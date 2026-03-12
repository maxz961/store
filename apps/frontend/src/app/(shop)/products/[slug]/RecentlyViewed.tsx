'use client';

import { useMemo } from 'react';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { useRecentlyViewedStore } from '@/store/recentlyViewed';
import type { RecentlyViewedProps } from './page.types';


export const RecentlyViewed = ({ currentProductId }: RecentlyViewedProps) => {
  const items = useRecentlyViewedStore((s) => s.items);
  const hydrated = useRecentlyViewedStore((s) => s.hydrated);

  const filtered = useMemo(
    () => items.filter((item) => item.id !== currentProductId),
    [items, currentProductId],
  );

  if (!hydrated || filtered.length === 0) return null;

  return <ProductCarousel title="Недавно просмотренные" products={filtered} />;
};
