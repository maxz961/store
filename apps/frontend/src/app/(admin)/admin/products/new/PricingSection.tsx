'use client';

import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreateProductFormValues } from './page.constants';


export const PricingSection = () => {
  const { register, formState: { errors } } = useFormContext<CreateProductFormValues>();
  const { t } = useLanguage();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.product.pricingAndStock')}</h2>

      <div className={s.grid2}>
        <TextField
          label={t('admin.product.priceLabel')}
          tooltip={FIELD_TOOLTIPS.price}
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price')}
        />
        <TextField
          label={t('admin.product.oldPriceLabel')}
          tooltip={FIELD_TOOLTIPS.comparePrice}
          type="number"
          step="0.01"
          min="0"
          placeholder={t('admin.product.optional')}
          error={errors.comparePrice?.message}
          {...register('comparePrice')}
        />
      </div>

      <div className={s.grid2}>
        <TextField
          label={t('admin.product.stockLabel')}
          tooltip={FIELD_TOOLTIPS.stock}
          type="number"
          min="0"
          error={errors.stock?.message}
          {...register('stock')}
        />
        <TextField
          label="SKU"
          tooltip={FIELD_TOOLTIPS.sku}
          placeholder={t('admin.product.optional')}
          error={errors.sku?.message}
          {...register('sku')}
        />
      </div>
    </div>
  );
};
