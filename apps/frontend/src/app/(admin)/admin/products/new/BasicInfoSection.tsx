'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { When } from 'react-if';
import { TextField } from '@/components/ui/TextField';
import { TextareaField } from '@/components/ui/TextareaField';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreateProductFormValues } from './page.constants';


type LangTab = 'uk' | 'en';

export const BasicInfoSection = () => {
  const { register, formState: { errors, submitCount } } = useFormContext<CreateProductFormValues>();
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
        <h2 className={s.cardTitle}>Basic information</h2>
        <div className={s.langTabs}>
          <button
            type="button"
            onClick={handleSelectUk}
            className={cn(s.langTab, langTab === 'uk' && s.langTabActive)}
          >
            🇺🇦 UK
          </button>
          <button
            type="button"
            onClick={handleSelectEn}
            className={cn(s.langTab, langTab === 'en' && s.langTabActive)}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      <When condition={langTab === 'uk'}>
        <TextField
          label="Name (UK)"
          tooltip={FIELD_TOOLTIPS.name}
          placeholder="e.g. Wireless Headphones"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextareaField
          label="Description (UK)"
          tooltip={FIELD_TOOLTIPS.description}
          placeholder="Detailed product description..."
          error={errors.description?.message}
          {...register('description')}
        />
      </When>

      <When condition={langTab === 'en'}>
        <TextField
          label="Name (EN)"
          tooltip={FIELD_TOOLTIPS.nameEn}
          placeholder="e.g. Wireless Headphones"
          error={errors.nameEn?.message}
          {...register('nameEn')}
        />
        <TextareaField
          label="Description (EN)"
          tooltip={FIELD_TOOLTIPS.descriptionEn}
          placeholder="Detailed product description..."
          error={errors.descriptionEn?.message}
          {...register('descriptionEn')}
        />
      </When>

      <TextField
        label="Slug"
        tooltip={FIELD_TOOLTIPS.slug}
        hint="Generated automatically from name"
        inputClassName={s.slugInput}
        error={errors.slug?.message}
        {...register('slug')}
      />
    </div>
  );
};
