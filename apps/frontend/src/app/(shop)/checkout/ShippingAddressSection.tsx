import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/lib/i18n';
import { TextField } from '@/components/ui/TextField';
import { s } from './page.styled';
import type { CheckoutFormValues } from './page.constants';


export const ShippingAddressSection = () => {
  const { register, formState: { errors } } = useFormContext<CheckoutFormValues>();
  const { t } = useLanguage();

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>{t('checkout.address')}</h2>
      <div className={s.fieldGroup}>
        <TextField
          label="Full name"
          placeholder="John Smith"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <TextField
          label="Address"
          placeholder="123 Main St, Apt 5"
          error={errors.line1?.message}
          {...register('line1')}
        />

        <TextField
          label="Address (optional)"
          placeholder="Entrance, floor, intercom"
          error={errors.line2?.message}
          {...register('line2')}
        />

        <div className={s.fieldRow}>
          <TextField
            label="City"
            placeholder="Kyiv"
            error={errors.city?.message}
            {...register('city')}
          />
          <TextField
            label="State / Region"
            placeholder="Kyiv region"
            error={errors.state?.message}
            {...register('state')}
          />
        </div>

        <div className={s.fieldRow}>
          <TextField
            label="Postal code"
            placeholder="01001"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
          <TextField
            label="Country"
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
