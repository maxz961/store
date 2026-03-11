import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { SelectField } from '@/components/ui/SelectField';
import { s } from './page.styled';
import { FIELD_TOOLTIPS, DISCOUNT_TYPE_OPTIONS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


export const DiscountSection = () => {
  const { register, formState: { errors } } = useFormContext<CreatePromotionFormValues>();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Скидка</h2>

      <div className={s.grid2}>
        <SelectField
          label="Тип скидки"
          tooltip={FIELD_TOOLTIPS.discountType}
          options={DISCOUNT_TYPE_OPTIONS}
          error={errors.discountType?.message}
          {...register('discountType')}
        />

        <TextField
          label="Размер скидки"
          tooltip={FIELD_TOOLTIPS.discountValue}
          type="number"
          placeholder="25"
          error={errors.discountValue?.message}
          {...register('discountValue')}
        />
      </div>

      <TextField
        label="Позиция в карусели"
        tooltip={FIELD_TOOLTIPS.position}
        type="number"
        placeholder="0"
        error={errors.position?.message}
        {...register('position')}
      />
    </div>
  );
};
