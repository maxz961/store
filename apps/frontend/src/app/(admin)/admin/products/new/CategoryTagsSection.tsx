import { useFormContext } from 'react-hook-form';
import { When } from 'react-if';
import { SelectField } from '@/components/ui/SelectField';
import { TagToggleButton } from './TagToggleButton';
import { s } from './page.styled';
import type { CreateProductFormValues } from './page.constants';
import type { CategoryTagsSectionProps } from './page.types';

export const CategoryTagsSection = ({
  categoryOptions,
  tags,
  selectedTags,
  onToggleTag,
}: CategoryTagsSectionProps) => {
  const { register, formState: { errors } } = useFormContext<CreateProductFormValues>();

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>Категория и теги</h2>

      <SelectField
        label="Категория"
        placeholder="Выберите категорию"
        options={categoryOptions}
        error={errors.categoryId?.message}
        {...register('categoryId')}
      />

      <When condition={tags.length > 0}>
        <div>
          <p className={s.tagsTitle}>Теги</p>
          <div className={s.tagsWrapper}>
            {tags.map((tag) => (
              <TagToggleButton
                key={tag.id}
                tag={tag}
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
