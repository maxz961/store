import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


export const ScheduleSection = () => {
  const { register, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
  const { t } = useLanguage();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.promotion.scheduleTitle')}</h2>

      <div className={s.grid2}>
        <TextField
          label={t('admin.promotion.scheduleStartDate')}
          tooltip={FIELD_TOOLTIPS.startDate}
          type="datetime-local"
          inputClassName="!block"
          error={errors.startDate?.message}
          {...register('startDate')}
        />

        <TextField
          label={t('admin.promotion.scheduleEndDate')}
          tooltip={FIELD_TOOLTIPS.endDate}
          type="datetime-local"
          inputClassName="!block"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      <CheckboxField
        label={t('admin.promotion.scheduleActive')}
        tooltip={t('admin.promotion.scheduleActiveHint')}
        error={errors.isActive?.message}
        {...register('isActive')}
      />
    </div>
  );
};
