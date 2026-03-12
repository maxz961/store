import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


export const BannerSection = () => {
  const { register, watch, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
  const bgColor = watch('bannerBgColor');

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

      <div className={s.colorRow}>
        <TextField
          label="Цвет фона"
          tooltip={FIELD_TOOLTIPS.bannerBgColor}
          placeholder="#e8f5e9"
          error={errors.bannerBgColor?.message}
          {...register('bannerBgColor')}
        />
        <div
          className={s.colorPreview}
          style={{ backgroundColor: bgColor || '#f1f5f9' }}
        />
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
