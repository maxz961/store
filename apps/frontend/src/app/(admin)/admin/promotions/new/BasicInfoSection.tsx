'use client';

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { When } from 'react-if';
import { cn } from '@/lib/utils';
import { TextField } from '@/components/ui/TextField';
import { TextareaField } from '@/components/ui/TextareaField';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { CreatePromotionFormValues } from './page.constants';


interface BasicInfoSectionProps {
  langTab: 'uk' | 'en';
  onTabChange: (tab: 'uk' | 'en') => void;
}

export const BasicInfoSection = ({ langTab, onTabChange }: BasicInfoSectionProps) => {
  const { register, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
  const { t } = useLanguage();

  const handleTabUk = useCallback(() => onTabChange('uk'), [onTabChange]);
  const handleTabEn = useCallback(() => onTabChange('en'), [onTabChange]);

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.promotion.basicInfoTitle')}</h2>

      <div className={s.langTabs}>
        <button
          type="button"
          onClick={handleTabUk}
          className={cn(s.langTab, langTab === 'uk' && s.langTabActive)}
        >
          🇺🇦 UK
        </button>
        <button
          type="button"
          onClick={handleTabEn}
          className={cn(s.langTab, langTab === 'en' && s.langTabActive)}
        >
          🇬🇧 EN
        </button>
      </div>

      <When condition={langTab === 'uk'}>
        <div className="space-y-4">
          <TextField
            label={t('admin.promotion.title')}
            tooltip={t('admin.promotion.tooltip.title')}
            placeholder={t('admin.promotion.titlePlaceholder')}
            error={errors.title?.message}
            {...register('title')}
          />
          <TextareaField
            label={t('admin.promotion.description')}
            tooltip={t('admin.promotion.tooltip.description')}
            placeholder={t('admin.promotion.descriptionPlaceholder')}
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </When>

      <When condition={langTab === 'en'}>
        <div className="space-y-4">
          <TextField
            label={t('admin.promotion.titleEn')}
            tooltip={t('admin.promotion.tooltip.title')}
            placeholder={t('admin.promotion.titlePlaceholder')}
            error={errors.titleEn?.message}
            {...register('titleEn')}
          />
          <TextareaField
            label={t('admin.promotion.descriptionEn')}
            tooltip={t('admin.promotion.tooltip.description')}
            placeholder={t('admin.promotion.descriptionPlaceholder')}
            error={errors.descriptionEn?.message}
            {...register('descriptionEn')}
          />
        </div>
      </When>

      <TextField
        label={t('admin.promotion.slug')}
        tooltip={t('admin.promotion.tooltip.slug')}
        hint={t('admin.promotion.slugHint')}
        inputClassName={s.slugInput}
        error={errors.slug?.message}
        {...register('slug')}
      />
    </div>
  );
};
