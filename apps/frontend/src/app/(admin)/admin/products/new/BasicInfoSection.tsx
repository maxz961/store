import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { TextareaField } from '@/components/ui/TextareaField';
import { s } from './page.styled';
import type { CreateProductFormValues } from './page.constants';


export const BasicInfoSection = () => {
  const { register, formState: { errors } } = useFormContext<CreateProductFormValues>();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Основная информация</h2>

      <TextField
        label="Название товара"
        placeholder="Например: Беспроводные наушники"
        error={errors.name?.message}
        {...register('name')}
      />

      <TextField
        label="Slug"
        hint="Генерируется автоматически из названия"
        inputClassName={s.slugInput}
        error={errors.slug?.message}
        {...register('slug')}
      />

      <TextareaField
        label="Описание"
        placeholder="Подробное описание товара..."
        error={errors.description?.message}
        {...register('description')}
      />
    </div>
  );
};
