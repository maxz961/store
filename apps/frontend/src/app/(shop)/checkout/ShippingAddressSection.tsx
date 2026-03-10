import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { s } from './page.styled';
import type { CheckoutFormValues } from './page.constants';


export const ShippingAddressSection = () => {
  const { register, formState: { errors } } = useFormContext<CheckoutFormValues>();

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>Адрес доставки</h2>
      <div className={s.fieldGroup}>
        <TextField
          label="Полное имя"
          placeholder="Иван Петров"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <TextField
          label="Адрес"
          placeholder="ул. Шевченко, 10, кв. 5"
          error={errors.line1?.message}
          {...register('line1')}
        />

        <TextField
          label="Адрес (дополнительно)"
          placeholder="Подъезд, этаж, домофон"
          error={errors.line2?.message}
          {...register('line2')}
        />

        <div className={s.fieldRow}>
          <TextField
            label="Город"
            placeholder="Киев"
            error={errors.city?.message}
            {...register('city')}
          />
          <TextField
            label="Область / Регион"
            placeholder="Киевская обл."
            error={errors.state?.message}
            {...register('state')}
          />
        </div>

        <div className={s.fieldRow}>
          <TextField
            label="Почтовый индекс"
            placeholder="01001"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
          <TextField
            label="Страна"
            placeholder="UA"
            maxLength={2}
            error={errors.country?.message}
            {...register('country')}
          />
        </div>
      </div>
    </div>
  );
};
