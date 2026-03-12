'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';
import { ProductGallery } from '@/app/(shop)/products/[slug]/ProductGallery';
import { ProductInfo } from '@/app/(shop)/products/[slug]/ProductInfo';
import { useCategories, useTags } from '@/lib/hooks/useProducts';
import { s } from './page.styled';
import type { CreateProductFormValues } from './page.constants';
import type { ProductPreviewProps } from './page.types';
import type { ProductInfoProps } from '@/app/(shop)/products/[slug]/page.types';


export const ProductPreview = ({ isOpen, onClose, files }: ProductPreviewProps) => {
  const { watch } = useFormContext<CreateProductFormValues>();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  const values = watch();

  const fileUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      fileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  const urlImages = useMemo(() => {
    return values.imageUrls
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
  }, [values.imageUrls]);

  const allImages = useMemo(
    () => [...fileUrls, ...urlImages],
    [fileUrls, urlImages],
  );

  const product: ProductInfoProps['product'] = useMemo(() => {
    const category = categories.find((c) => c.id === values.categoryId);

    return {
      id: 'preview',
      name: values.name || 'Название товара',
      slug: values.slug || 'preview',
      price: parseFloat(values.price) || 0,
      comparePrice: values.comparePrice ? parseFloat(values.comparePrice) : undefined,
      images: allImages,
      stock: parseInt(values.stock, 10) || 0,
      category: {
        name: category?.name ?? '',
        slug: category?.slug ?? '',
      },
      tags: tags
        .filter((t) => values.tagIds.includes(t.id))
        .map((t) => ({ tag: { name: t.name, slug: t.slug } })),
      reviews: [],
      description: values.description || '',
    };
  }, [values, categories, tags, allImages]);

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

        <div className={s.previewLayout}>
          <ProductGallery images={allImages} name={product.name} unoptimized />
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
};
