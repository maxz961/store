'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { X, ImageIcon } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import Image from 'next/image';
import { formatCurrency } from '@/lib/constants/format';
import { useCategories, useTags } from '@/lib/hooks/useProducts';
import { s } from './page.styled';
import type { CreateProductFormValues } from './page.constants';
import type { ProductPreviewProps } from './page.types';


export const ProductPreview = ({ isOpen, onClose }: ProductPreviewProps) => {
  const { watch } = useFormContext<CreateProductFormValues>();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  const values = watch();

  const price = parseFloat(values.price) || 0;
  const comparePrice = values.comparePrice ? parseFloat(values.comparePrice) : null;

  const categoryName = useMemo(
    () => categories.find((c) => c.id === values.categoryId)?.name ?? '',
    [categories, values.categoryId],
  );

  const selectedTagNames = useMemo(
    () => tags.filter((t) => values.tagIds.includes(t.id)).map((t) => t.name),
    [tags, values.tagIds],
  );

  const imageUrls = useMemo(() => {
    const urls = values.imageUrls
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
    return urls;
  }, [values.imageUrls]);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={s.previewOverlay} onClick={handleOverlayClick}>
      <div className={s.previewModal}>
        <button type="button" className={s.previewClose} onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <If condition={imageUrls.length > 0}>
          <Then>
            <div className={s.previewGallery}>
              <div className={s.previewMainImage}>
                <Image
                  src={imageUrls[0]}
                  alt={values.name || 'Превью'}
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              </div>
              {imageUrls.slice(1, 5).map((url) => (
                <div key={url} className={s.previewThumb}>
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </Then>
          <Else>
            <div className={s.previewEmpty}>
              <ImageIcon className="mr-2 h-5 w-5" />
              Изображения не добавлены
            </div>
          </Else>
        </If>

        <When condition={!!categoryName}>
          <span className={s.previewBadge}>{categoryName}</span>
        </When>

        <h2 className={s.previewTitle}>
          {values.name || 'Название товара'}
        </h2>

        <div className={s.previewPrice}>
          <span className={s.previewCurrentPrice}>
            {price > 0 ? formatCurrency(price) : '0 ₴'}
          </span>
          <When condition={!!comparePrice && comparePrice! > price}>
            <span className={s.previewComparePrice}>
              {formatCurrency(comparePrice!)}
            </span>
          </When>
        </div>

        <When condition={!!values.description}>
          <p className={s.previewDescription}>{values.description}</p>
        </When>

        <When condition={selectedTagNames.length > 0}>
          <div className={s.previewMeta}>
            {selectedTagNames.map((name) => (
              <span key={name} className={s.previewTag}>{name}</span>
            ))}
          </div>
        </When>
      </div>
    </div>
  );
};
