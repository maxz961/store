import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


export const ScheduleSection = () => {
  const { register, formState: { errors } } = useFormContext<CreatePromotionFormValues>();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Расписание</h2>

      <div className={s.grid2}>
        <TextField
          label="Дата начала"
          tooltip={FIELD_TOOLTIPS.startDate}
          type="datetime-local"
          inputClassName="!block"
          error={errors.startDate?.message}
          {...register('startDate')}
        />

        <TextField
          label="Дата окончания"
          tooltip={FIELD_TOOLTIPS.endDate}
          type="datetime-local"
          inputClassName="!block"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      <CheckboxField
        label="Активна"
        tooltip="Если выключено — акция не будет отображаться в каталоге даже в период действия"
        error={errors.isActive?.message}
        {...register('isActive')}
      />
    </div>
  );
};
