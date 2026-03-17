import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { CreatePromotionFormValues } from './page.constants';


export const ScheduleSection = () => {
  const { register, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
  const { t, lang } = useLanguage();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.promotion.scheduleTitle')}</h2>

      <div className={s.grid2}>
        <TextField
          label={t('admin.promotion.scheduleStartDate')}
          tooltip={t('admin.promotion.tooltip.startDate')}
          type="datetime-local"
          lang={lang}
          inputClassName="!block"
          error={errors.startDate?.message}
          {...register('startDate')}
        />

        <TextField
          label={t('admin.promotion.scheduleEndDate')}
          tooltip={t('admin.promotion.tooltip.endDate')}
          type="datetime-local"
          lang={lang}
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
