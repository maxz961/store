'use client';

import { useFormContext, useController } from 'react-hook-form';
import { When } from 'react-if';
import { SelectField } from '@/components/ui/SelectField';
import { FieldTooltip } from '@/components/ui/FieldTooltip';
import { useLanguage } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import { TagToggleButton } from './TagToggleButton';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { CreateProductFormValues } from './page.constants';
import type { CategoryTagsSectionProps } from './page.types';


export const CategoryTagsSection = ({
  categoryOptions,
  tags,
  selectedTags,
  onToggleTag,
}: CategoryTagsSectionProps) => {
  const { control, formState: { errors } } = useFormContext<CreateProductFormValues>();
  const { field: categoryField } = useController({ name: 'categoryId', control });
  const { t, lang } = useLanguage();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>{t('admin.product.categoryAndTags')}</h2>

      <SelectField
        label={t('admin.product.category')}
        tooltip={FIELD_TOOLTIPS.categoryId}
        placeholder={t('admin.product.selectCategory')}
        options={categoryOptions}
        error={errors.categoryId?.message}
        {...categoryField}
      />

      <When condition={tags.length > 0}>
        <div>
          <p className={s.tagsTitle}>
            {t('admin.product.tags')}
            <FieldTooltip text={FIELD_TOOLTIPS.tags} />
          </p>
          <div className={s.tagsWrapper}>
            {tags.map((tag) => (
              <TagToggleButton
                key={tag.id}
                tag={tag}
                label={getLocalizedText(lang, tag.name, tag.nameEn)}
                isActive={selectedTags.includes(tag.id)}
                onClick={onToggleTag(tag.id)}
              />
            ))}
          </div>
        </div>
      </When>
    </div>
  );
};
