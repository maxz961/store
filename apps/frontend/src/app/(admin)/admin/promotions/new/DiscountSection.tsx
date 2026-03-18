import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { SelectField } from '@/components/ui/SelectField';
import { useLanguage } from '@/lib/i18n';
import { usePromotions } from '@/lib/hooks/usePromotions';
import { s } from './page.styled';
import { DISCOUNT_TYPE_OPTIONS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


interface DiscountSectionProps {
  currentPromotionId?: string;
}


export const DiscountSection = ({ currentPromotionId }: DiscountSectionProps) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
  const { t } = useLanguage();
  const { data: allPromotionsData } = usePromotions();

  const discountType = watch('discountType');
  const positionValue = watch('position');

  const handleDiscountTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('discountType', e.target.value as 'PERCENTAGE' | 'FIXED', { shouldValidate: true });
    },
    [setValue],
  );

  const handlePositionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('position', e.target.value, { shouldValidate: true });
    },
    [setValue],
  );

  const positionOptions = useMemo(() => {
    const promotions = allPromotionsData ?? [];
    const taken = new Map(
      promotions
        .filter((p) => p.id !== currentPromotionId)
        .map((p) => [p.position, p.title]),
    );
    const maxPos = promotions.length;
    return Array.from({ length: maxPos + 1 }, (_, i) => {
      const takenBy = taken.get(i);
      return {
        value: String(i),
        label: takenBy ? `${i} — ${takenBy}` : String(i),
        disabled: !!takenBy,
      };
    });
  }, [allPromotionsData, currentPromotionId]);

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.promotion.discountTitle')}</h2>

      <div className={s.grid2}>
        <SelectField
          label={t('admin.promotion.discountType')}
          tooltip={t('admin.promotion.tooltip.discountType')}
          options={DISCOUNT_TYPE_OPTIONS}
          value={discountType}
          onChange={handleDiscountTypeChange}
          error={errors.discountType?.message}
        />

        <TextField
          label={t('admin.promotion.discountValue')}
          tooltip={t('admin.promotion.tooltip.discountValue')}
          type="number"
          placeholder="25"
          error={errors.discountValue?.message}
          {...register('discountValue')}
        />
      </div>

      <SelectField
        label={t('admin.promotion.discountPosition')}
        tooltip={t('admin.promotion.tooltip.position')}
        options={positionOptions}
        value={positionValue}
        onChange={handlePositionChange}
        error={errors.position?.message}
      />
    </div>
  );
};
