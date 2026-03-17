'use client';

import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
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
          tooltip={t('admin.product.tooltip.price')}
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price')}
        />
        <TextField
          label={t('admin.product.oldPriceLabel')}
          tooltip={t('admin.product.tooltip.comparePrice')}
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
          tooltip={t('admin.product.tooltip.stock')}
          type="number"
          min="0"
          error={errors.stock?.message}
          {...register('stock')}
        />
        <TextField
          label="SKU"
          tooltip={t('admin.product.tooltip.sku')}
          placeholder={t('admin.product.optional')}
          error={errors.sku?.message}
          {...register('sku')}
        />
      </div>
    </div>
  );
};
