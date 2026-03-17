'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { When } from 'react-if';
import { TextField } from '@/components/ui/TextField';
import { TextareaField } from '@/components/ui/TextareaField';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { CreateProductFormValues } from './page.constants';


type LangTab = 'uk' | 'en';

export const BasicInfoSection = () => {
  const { register, formState: { errors, submitCount } } = useFormContext<CreateProductFormValues>();
  const { t } = useLanguage();
  const [langTab, setLangTab] = useState<LangTab>('uk');
  const lastHandledSubmit = useRef(0);

  const hasEnError = !!(errors.nameEn || errors.descriptionEn);
  const hasUkError = !!(errors.name || errors.description);

  // Auto-switch tab only once per submit attempt — not while user is typing
  useEffect(() => {
    const isNewSubmit = submitCount > 0 && submitCount !== lastHandledSubmit.current;
    if (!isNewSubmit || (!hasUkError && !hasEnError)) return;
    lastHandledSubmit.current = submitCount;
    if (hasUkError && !hasEnError) setLangTab('uk');
    else if (hasEnError && !hasUkError) setLangTab('en');
    // Both tabs have errors — stay on current tab, user decides where to start
  }, [hasUkError, hasEnError, submitCount]);

  const handleSelectUk = useCallback(() => setLangTab('uk'), []);
  const handleSelectEn = useCallback(() => setLangTab('en'), []);

  return (
    <div className={s.card}>
      <div className="flex items-center justify-between">
        <h2 className={s.cardTitle}>{t('admin.product.basicInfo')}</h2>
        <div className={s.langTabs}>
          <button
            type="button"
            onClick={handleSelectUk}
            className={cn(s.langTab, langTab === 'uk' && s.langTabActive)}
          >
            🇺🇦 {t('common.langUk')}
          </button>
          <button
            type="button"
            onClick={handleSelectEn}
            className={cn(s.langTab, langTab === 'en' && s.langTabActive)}
          >
            🇬🇧 {t('common.langEn')}
          </button>
        </div>
      </div>

      <When condition={langTab === 'uk'}>
        <TextField
          label={t('admin.product.name')}
          tooltip={t('admin.product.tooltip.name')}
          placeholder="e.g. Wireless Headphones"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextareaField
          label={t('admin.product.description')}
          tooltip={t('admin.product.tooltip.description')}
          placeholder="Detailed product description..."
          error={errors.description?.message}
          {...register('description')}
        />
      </When>

      <When condition={langTab === 'en'}>
        <TextField
          label={t('admin.product.nameEn')}
          tooltip={t('admin.product.tooltip.nameEn')}
          placeholder="e.g. Wireless Headphones"
          error={errors.nameEn?.message}
          {...register('nameEn')}
        />
        <TextareaField
          label={t('admin.product.descriptionEn')}
          tooltip={t('admin.product.tooltip.descriptionEn')}
          placeholder="Detailed product description..."
          error={errors.descriptionEn?.message}
          {...register('descriptionEn')}
        />
      </When>

      <TextField
        label={t('admin.product.slug')}
        tooltip={t('admin.product.tooltip.slug')}
        hint={t('admin.product.slugHint')}
        inputClassName={s.slugInput}
        error={errors.slug?.message}
        {...register('slug')}
      />
    </div>
  );
};
