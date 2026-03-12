import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { TextareaField } from '@/components/ui/TextareaField';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


export const BasicInfoSection = () => {
  const { register, formState: { errors } } = useFormContext<CreatePromotionFormValues>();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Основная информация</h2>

      <TextField
        label="Название акции"
        tooltip={FIELD_TOOLTIPS.title}
        placeholder="Например: Весенняя распродажа"
        error={errors.title?.message}
        {...register('title')}
      />

      <TextField
        label="Slug"
        tooltip={FIELD_TOOLTIPS.slug}
        hint="Генерируется автоматически из названия"
        inputClassName={s.slugInput}
        error={errors.slug?.message}
        {...register('slug')}
      />

      <TextareaField
        label="Описание"
        tooltip={FIELD_TOOLTIPS.description}
        placeholder="Краткое описание акции..."
        error={errors.description?.message}
        {...register('description')}
      />
    </div>
  );
};
