import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { s } from './page.styled';
import type { CreateProductFormValues } from './page.constants';

export const PricingSection = () => {
  const { register, formState: { errors } } = useFormContext<CreateProductFormValues>();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Цена и склад</h2>

      <div className={s.grid2}>
        <TextField
          label="Цена (₴)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price')}
        />
        <TextField
          label="Старая цена (₴)"
          type="number"
          step="0.01"
          min="0"
          placeholder="Необязательно"
          error={errors.comparePrice?.message}
          {...register('comparePrice')}
        />
      </div>

      <div className={s.grid2}>
        <TextField
          label="Остаток на складе"
          type="number"
          min="0"
          error={errors.stock?.message}
          {...register('stock')}
        />
        <TextField
          label="SKU"
          placeholder="Необязательно"
          error={errors.sku?.message}
          {...register('sku')}
        />
      </div>
    </div>
  );
};
