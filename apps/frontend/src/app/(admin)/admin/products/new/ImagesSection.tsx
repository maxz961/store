'use client';

import { useState, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { When } from 'react-if';
import { X } from 'lucide-react';
import Image from 'next/image';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { TextField } from '@/components/ui/TextField';
import { FieldTooltip } from '@/components/ui/FieldTooltip';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreateProductFormValues } from './page.constants';
import type { ImagesSectionProps } from './page.types';


type UploadMode = 'file' | 'url';

export const ImagesSection = ({ files, onFilesChange }: ImagesSectionProps) => {
  const [mode, setMode] = useState<UploadMode>('file');
  const { register, watch, setValue, formState: { errors } } = useFormContext<CreateProductFormValues>();

  const imageUrlsValue = watch('imageUrls');
  const existingImages = useMemo(
    () => (imageUrlsValue ? imageUrlsValue.split(',').map((u) => u.trim()).filter(Boolean) : []),
    [imageUrlsValue],
  );

  const handleSetFileMode = useCallback(() => setMode('file'), []);

  const handleSetUrlMode = useCallback(() => setMode('url'), []);

  const handleRemoveExisting = useCallback((url: string) => () => {
    const updated = existingImages.filter((u) => u !== url);
    setValue('imageUrls', updated.join(', '));
  }, [existingImages, setValue]);

  return (
    <div className={s.card}>
      <div className="flex items-center gap-2">
        <h2 className={s.cardTitle}>Изображения</h2>
        <FieldTooltip text={FIELD_TOOLTIPS.images} />
      </div>

      <div className={s.imageTabs}>
        <button
          type="button"
          className={cn(s.imageTab, mode === 'file' && s.imageTabActive)}
          onClick={handleSetFileMode}
        >
          Загрузить файл
        </button>
        <button
          type="button"
          className={cn(s.imageTab, mode === 'url' && s.imageTabActive)}
          onClick={handleSetUrlMode}
        >
          По ссылке
        </button>
      </div>

      <When condition={mode === 'file'}>
        <div className="space-y-3">
          <ImageUpload
            files={files}
            onChange={onFilesChange}
            maxFiles={6}
          />

          <When condition={existingImages.length > 0}>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Текущие изображения</p>
              <div className={s.existingThumbs}>
                {existingImages.map((url) => (
                  <div key={url} className={s.existingThumb}>
                    <Image src={url} alt="" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      className={s.existingThumbRemove}
                      onClick={handleRemoveExisting(url)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </When>
        </div>
      </When>

      <When condition={mode === 'url'}>
        <TextField
          label="URL изображений"
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          hint="Несколько URL через запятую"
          error={errors.imageUrls?.message}
          {...register('imageUrls')}
        />
      </When>
    </div>
  );
};
