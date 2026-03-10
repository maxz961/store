'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { When } from 'react-if';
import { useProductParams } from '@/lib/hooks/useProductParams';
import type { Props } from './ProductFilters.types';
import { s } from './ProductFilters.styled';

export const ProductFilters = ({ categories, tags, currentCategory, currentTags }: Props) => {
  const { update, reset } = useProductParams();

  const toggleTag = (slug: string) => {
    const next = currentTags.includes(slug)
      ? currentTags.filter((t) => t !== slug)
      : [...currentTags, slug];
    update({ tagSlugs: next });
  };

  const handleClearCategory = () => update({ categorySlug: undefined });

  const handleSelectCategory = (slug: string) => () => update({ categorySlug: slug });

  const handleToggleTag = (slug: string) => () => toggleTag(slug);

  const hasFilters = currentCategory || currentTags.length > 0;

  return (
    <div className={s.wrapper}>
      <When condition={categories.length > 0}>
        <div className={s.section}>
          <p className={s.label}>Категории</p>
          <div className={s.categoryList}>
            <button
              onClick={handleClearCategory}
              className={cn(s.categoryItem, !currentCategory ? s.categoryActive : s.categoryInactive)}
            >
              Все товары
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={handleSelectCategory(cat.slug)}
                className={cn(s.categoryItem, currentCategory === cat.slug ? s.categoryActive : s.categoryInactive)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </When>

      <When condition={tags.length > 0}>
        <div className={s.divider} />
        <div className={s.section}>
          <p className={s.label}>Теги</p>
          <div className={s.tags}>
            {tags.map((tag) => (
              <button key={tag.id} onClick={handleToggleTag(tag.slug)}>
                <Badge
                  variant={currentTags.includes(tag.slug) ? 'default' : 'outline'}
                  className="cursor-pointer transition-opacity duration-150 hover:opacity-80"
                >
                  {tag.name}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </When>

      <When condition={hasFilters}>
        <div className={s.divider} />
        <button
          className={s.resetButton}
          onClick={reset}
        >
          Сбросить фильтры
        </button>
      </When>
    </div>
  );
};
