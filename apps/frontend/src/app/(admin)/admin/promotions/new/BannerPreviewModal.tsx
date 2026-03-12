'use client';

import { useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { PromoBannerSlide } from '@/app/(shop)/products/PromoBanner/PromoBannerSlide';
import { s } from './page.styled';
import type { CreatePromotionFormValues } from './page.constants';


interface BannerPreviewModalProps {
  onClose: () => void;
}

const formatDiscount = (type: 'PERCENTAGE' | 'FIXED', value: number) =>
  type === 'PERCENTAGE' ? `-${value}%` : `-$${value}`;


export const BannerPreviewModal = ({ onClose }: BannerPreviewModalProps) => {
  const { watch } = useFormContext<CreatePromotionFormValues>();
  const { title, description, bannerImageUrl, bannerBgColor, discountType, discountValue, link } = watch();

  const discountNum = parseFloat(discountValue) || 0;
  const bgColor = bannerBgColor || '#f1f5f9';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <div className={s.previewOverlay} onClick={handleBackdropClick}>
      <div className={s.previewModal}>
        <div className={s.previewHeader}>
          <h3 className={s.previewTitle}>Предосмотр баннера</h3>
          <button type="button" className={s.previewClose} onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className={s.previewHint}>Так баннер будет выглядеть в каталоге</p>

        <If condition={!!bannerImageUrl}>
          <Then>
            <PromoBannerSlide
              title={title || 'Название акции'}
              description={description || null}
              bannerImageUrl={bannerImageUrl}
              bannerBgColor={bgColor}
              discountType={discountType}
              discountValue={discountNum}
              link={link || null}
            />
          </Then>
          <Else>
            <div className={s.previewSlide} style={{ backgroundColor: bgColor }}>
              <div className={s.previewSlideLeft}>
                <span className={s.previewSlideDiscount}>
                  {formatDiscount(discountType, discountNum)}
                </span>
                <h3 className={s.previewSlideTitle}>{title || 'Название акции'}</h3>
                <When condition={!!description}>
                  <p className={s.previewSlideDesc}>{description}</p>
                </When>
              </div>
              <div className={s.previewNoImage}>
                Изображение не загружено
              </div>
            </div>
          </Else>
        </If>
      </div>
    </div>
  );
};
