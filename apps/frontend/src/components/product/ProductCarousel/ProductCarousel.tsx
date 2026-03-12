'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { When } from 'react-if';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { s } from './ProductCarousel.styled';
import type { ProductCarouselProps } from './ProductCarousel.types';


const SCROLL_AMOUNT = 460;

export const ProductCarousel = ({ title, products }: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollState, products]);

  const handleScrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  }, []);

  const handleScrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  }, []);

  if (products.length === 0) return null;

  return (
    <div className={s.section}>
      <h2 className={s.title}>{title}</h2>
      <div className={s.wrapper}>
        <When condition={canScrollLeft}>
          <button className={cn(s.arrow, s.arrowLeft)} onClick={handleScrollLeft}>
            <ChevronLeft className={s.arrowIcon} />
          </button>
        </When>

        <div ref={scrollRef} className={s.track} onScroll={updateScrollState}>
          {products.map((product) => (
            <div key={product.id} className={s.card}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <When condition={canScrollRight}>
          <button className={cn(s.arrow, s.arrowRight)} onClick={handleScrollRight}>
            <ChevronRight className={s.arrowIcon} />
          </button>
        </When>
      </div>
    </div>
  );
};
