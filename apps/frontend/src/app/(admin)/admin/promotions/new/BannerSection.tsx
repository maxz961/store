'use client';

import { useState, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { When } from 'react-if';
import { Eye, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TextField } from '@/components/ui/TextField';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Spinner } from '@/components/ui/Spinner';
import { FieldTooltip } from '@/components/ui/FieldTooltip';
import { useUploadProductImages } from '@/lib/hooks/useAdmin';
import { useLanguage } from '@/lib/i18n';
import { BannerPreviewModal } from './BannerPreviewModal';
import { s } from './page.styled';
import { BANNER_BG_PRESET_COLORS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


type ImageMode = 'file' | 'url';

export const BannerSection = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
  const { t } = useLanguage();
  const [mode, setMode] = useState<ImageMode>('file');
  const [files, setFiles] = useState<File[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const uploadImages = useUploadProductImages();
  const { mutateAsync: mutateUpload } = uploadImages;

  const bgColor = watch('bannerBgColor');
  const bannerImageUrl = watch('bannerImageUrl');

  const handleSetFileMode = useCallback(() => setMode('file'), []);

  const handleSetUrlMode = useCallback(() => {
    setMode('url');
    setFiles([]);
  }, []);

  const handleOpenPreview = useCallback(() => setIsPreviewOpen(true), []);

  const handleClosePreview = useCallback(() => setIsPreviewOpen(false), []);

  const handleFilesChange = useCallback(async (newFiles: File[]) => {
    setFiles(newFiles);

    if (newFiles.length === 0) {
      setValue('bannerImageUrl', '');
      return;
    }

    try {
      const result = await mutateUpload(newFiles.slice(0, 1));
      setValue('bannerImageUrl', result.urls[0] ?? '');
    } catch {
      // uploadImages.isError reflects the failure
    }
  }, [setValue, mutateUpload]);

  const handleRemoveCurrentImage = useCallback(() => {
    setValue('bannerImageUrl', '');
    setFiles([]);
  }, [setValue]);

  const handleSelectColor = useCallback((color: string) => () => {
    setValue('bannerBgColor', color);
  }, [setValue]);

  const colorSwatches = useMemo(() =>
    BANNER_BG_PRESET_COLORS.map((color) => (
      <button
        key={color}
        type="button"
        title={color}
        className={cn(s.swatch, bgColor === color && s.swatchActive)}
        style={{ backgroundColor: color }}
        onClick={handleSelectColor(color)}
      />
    )), [bgColor, handleSelectColor]);

  return (
    <div className={s.card}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h2 className={s.cardTitle}>{t('admin.promotion.bannerTitle')}</h2>
          <FieldTooltip text={t('admin.promotion.tooltip.banner')} />
        </div>
        <button type="button" className={s.previewBtn} onClick={handleOpenPreview}>
          <Eye className="h-4 w-4" />
          {t('admin.promotion.bannerPreview')}
        </button>
      </div>

      <div className={s.imageTabs}>
        <button
          type="button"
          className={cn(s.imageTab, mode === 'file' && s.imageTabActive)}
          onClick={handleSetFileMode}
        >
          {t('admin.promotion.bannerUploadFile')}
        </button>
        <button
          type="button"
          className={cn(s.imageTab, mode === 'url' && s.imageTabActive)}
          onClick={handleSetUrlMode}
        >
          {t('admin.promotion.bannerByUrl')}
        </button>
      </div>

      <When condition={mode === 'file'}>
        <div className="space-y-3">
          <When condition={!!bannerImageUrl && files.length === 0}>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">{t('admin.promotion.bannerCurrent')}</p>
              <div className={s.bannerThumbWrapper}>
                <Image
                  src={bannerImageUrl}
                  alt={t('admin.promotion.bannerTitle')}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  className={s.bannerThumbRemove}
                  onClick={handleRemoveCurrentImage}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </When>

          <When condition={!bannerImageUrl || files.length > 0}>
            <div>
              <ImageUpload files={files} onChange={handleFilesChange} maxFiles={1} />
              <When condition={uploadImages.isPending}>
                <div className={s.imageUploadPending}>
                  <Spinner size="sm" />
                  <span>{t('admin.promotion.bannerUploading')}</span>
                </div>
              </When>
              <When condition={uploadImages.isError}>
                <p className={s.error}>
                  {uploadImages.error instanceof Error
                    ? uploadImages.error.message
                    : t('admin.promotion.bannerUploadFailed')}
                </p>
              </When>
            </div>
          </When>
        </div>
      </When>

      <When condition={mode === 'url'}>
        <TextField
          label={t('admin.promotion.bannerImageUrl')}
          tooltip={t('admin.promotion.tooltip.bannerImageUrl')}
          placeholder="https://images.unsplash.com/..."
          error={errors.bannerImageUrl?.message}
          {...register('bannerImageUrl')}
        />
      </When>

      <div className={s.colorSection}>
        <label className={s.colorLabel}>{t('admin.promotion.bannerBgColor')}</label>
        <div className={s.swatches}>
          {colorSwatches}
        </div>
        <p className={s.colorHint}>{t('admin.promotion.bannerCurrentColor')} {bgColor || '—'}</p>
      </div>

      <TextField
        label={t('admin.promotion.bannerLink')}
        tooltip={t('admin.promotion.tooltip.link')}
        placeholder="/products?tagSlugs=sale"
        error={errors.link?.message}
        {...register('link')}
      />

      <When condition={isPreviewOpen}>
        <BannerPreviewModal onClose={handleClosePreview} />
      </When>
    </div>
  );
};
