'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { When } from 'react-if';
import { cn, getLocalizedText } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { useActivePromotions } from '@/lib/hooks/usePromotions';
import { s } from './PromoBanner.styled';
import { PromoBannerSlide } from './PromoBannerSlide';


const AUTOPLAY_INTERVAL = 5000;

export const PromoBanner = () => {
  const { data: promotions = [] } = useActivePromotions();
  const { t, lang } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = promotions.length;

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  const handleDotClick = (index: number) => () => {
    setCurrent(index);
  };

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(handleNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [total, isPaused, handleNext]);

  if (total === 0) return null;

  return (
    <div
      className={s.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={s.viewport}>
        <div
          className={s.track}
          data-testid="promo-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {promotions.map((promo) => (
            <PromoBannerSlide
              key={promo.id}
              title={getLocalizedText(lang, promo.title, promo.titleEn)}
              description={getLocalizedText(lang, promo.description ?? '', promo.descriptionEn)}
              bannerImageUrl={promo.bannerImageUrl}
              bannerBgColor={promo.bannerBgColor}
              discountType={promo.discountType}
              discountValue={promo.discountValue}
              slug={promo.slug}
            />
          ))}
        </div>
      </div>

      <When condition={total > 1}>
        <button
          type="button"
          className={cn(s.arrowBase, s.arrowLeft)}
          onClick={handlePrev}
          aria-label={t('promotions.prevBanner')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={cn(s.arrowBase, s.arrowRight)}
          onClick={handleNext}
          aria-label={t('promotions.nextBanner')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </When>

      <When condition={total > 1}>
        <div className={s.dotsWrapper}>
          {promotions.map((promo, i) => (
            <button
              key={promo.id}
              type="button"
              className={cn(s.dot, i === current ? s.dotActive : s.dotInactive)}
              onClick={handleDotClick(i)}
              aria-label={`${t('promotions.bannerLabel')} ${i + 1}`}
            />
          ))}
        </div>
      </When>
    </div>
  );
};
