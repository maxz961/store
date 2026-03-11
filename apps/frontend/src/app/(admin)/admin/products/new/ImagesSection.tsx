'use client';

import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { When } from 'react-if';
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
  const { register, formState: { errors } } = useFormContext<CreateProductFormValues>();

  const handleSetFileMode = useCallback(() => setMode('file'), []);

  const handleSetUrlMode = useCallback(() => setMode('url'), []);

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
        <ImageUpload
          files={files}
          onChange={onFilesChange}
          maxFiles={5}
        />
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
