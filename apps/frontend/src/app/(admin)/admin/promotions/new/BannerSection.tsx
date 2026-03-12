import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { TextField } from '@/components/ui/TextField';
import { s } from './page.styled';
import { FIELD_TOOLTIPS, BANNER_BG_PRESET_COLORS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


export const BannerSection = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
  const bgColor = watch('bannerBgColor');

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
      <h2 className={s.cardTitle}>Баннер</h2>

      <TextField
        label="URL изображения"
        tooltip={FIELD_TOOLTIPS.bannerImageUrl}
        placeholder="https://images.unsplash.com/..."
        error={errors.bannerImageUrl?.message}
        {...register('bannerImageUrl')}
      />

      <div className={s.colorSection}>
        <label className={s.colorLabel}>Цвет фона</label>
        <div className={s.swatches}>
          {colorSwatches}
          <div
            className={s.colorPreview}
            title={bgColor || '—'}
            style={{ backgroundColor: bgColor || '#f1f5f9' }}
          />
        </div>
        <p className={s.colorHint}>Текущий: {bgColor || '—'}</p>
      </div>

      <TextField
        label="Ссылка"
        tooltip={FIELD_TOOLTIPS.link}
        placeholder="/products?tagSlugs=sale"
        error={errors.link?.message}
        {...register('link')}
      />
    </div>
  );
};
