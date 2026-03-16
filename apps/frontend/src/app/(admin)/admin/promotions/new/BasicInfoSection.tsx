'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { TextField } from '@/components/ui/TextField';
import { TextareaField } from '@/components/ui/TextareaField';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreatePromotionFormValues } from './page.constants';


export const BasicInfoSection = () => {
  const [langTab, setLangTab] = useState<'uk' | 'en'>('uk');
  const { register, formState: { errors } } = useFormContext<CreatePromotionFormValues>();

  useEffect(() => {
    if (errors.titleEn) {
      setLangTab('en');
    }
  }, [errors.titleEn]);

  const handleTabUk = () => setLangTab('uk');
  const handleTabEn = () => setLangTab('en');

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Basic information</h2>

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

      {langTab === 'uk' && (
        <>
          <TextField
            label="Title (UK)"
            tooltip={FIELD_TOOLTIPS.title}
            placeholder="e.g. Spring Sale"
            error={errors.title?.message}
            {...register('title')}
          />

          <TextareaField
            label="Description (UK)"
            tooltip={FIELD_TOOLTIPS.description}
            placeholder="Short promotion description..."
            error={errors.description?.message}
            {...register('description')}
          />
        </>
      )}

      {langTab === 'en' && (
        <>
          <TextField
            label="Title (EN)"
            tooltip={FIELD_TOOLTIPS.title}
            placeholder="e.g. Spring Sale"
            error={errors.titleEn?.message}
            {...register('titleEn')}
          />

          <TextareaField
            label="Description (EN)"
            tooltip={FIELD_TOOLTIPS.description}
            placeholder="Short promotion description..."
            error={errors.descriptionEn?.message}
            {...register('descriptionEn')}
          />
        </>
      )}

      <TextField
        label="Slug"
        tooltip={FIELD_TOOLTIPS.slug}
        hint="Generated automatically from title"
        inputClassName={s.slugInput}
        error={errors.slug?.message}
        {...register('slug')}
      />
    </div>
  );
};
