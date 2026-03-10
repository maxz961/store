import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { s } from './page.styled';
import type { CreateProductFormValues } from './page.constants';


export const ImagesSection = () => {
  const { register, formState: { errors } } = useFormContext<CreateProductFormValues>();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Изображения</h2>

      <TextField
        label="URL изображений"
        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
        hint="Несколько URL через запятую"
        error={errors.images?.message}
        {...register('images')}
      />
    </div>
  );
};
