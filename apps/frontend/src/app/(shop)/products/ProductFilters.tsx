'use client';

import { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { When } from 'react-if';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { usePriceRange } from '@/lib/hooks/useProducts';
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider';
import { CategoryButton } from './CategoryButton';
import { TagButton } from './TagButton';
import { SORT_OPTIONS } from './ProductFilters.constants';
import type { Props } from './ProductFilters.types';
import { s } from './ProductFilters.styled';


export const ProductFilters = ({
  categories,
  tags,
  currentCategory,
  currentTags,
  currentMinPrice,
  currentMaxPrice,
  currentSort,
}: Props) => {
  const { update, reset } = useProductParams();
  const { data: priceRange } = usePriceRange();

  const filteredCategories = useMemo(
    () => categories.filter((c) => (c._count?.products ?? 0) > 0),
    [categories],
  );

  const filteredTags = useMemo(
    () => tags.filter((t) => (t._count?.products ?? 0) > 0),
    [tags],
  );

  const hasFilters = !!(
    currentCategory ||
    currentTags.length > 0 ||
    currentMinPrice ||
    currentMaxPrice ||
    currentSort
  );

  const handlePriceRangeChange = useCallback(
    ([newMin, newMax]: [number, number]) => {
      update({ minPrice: String(newMin), maxPrice: String(newMax) });
    },
    [update],
  );

  const toggleTag = useCallback((slug: string) => {
    const next = currentTags.includes(slug)
      ? currentTags.filter((t) => t !== slug)
      : [...currentTags, slug];
    update({ tagSlugs: next });
  }, [currentTags, update]);

  const handleClearCategory = useCallback(() => update({ categorySlug: undefined }), [update]);

  const handleSelectCategory = useCallback(
    (slug: string) => () => update({ categorySlug: slug }),
    [update],
  );

  const handleToggleTag = useCallback(
    (slug: string) => () => toggleTag(slug),
    [toggleTag],
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      const [sortBy, sortOrder] = val ? val.split('_') : [undefined, undefined];
      update({ sortBy, sortOrder });
    },
    [update],
  );

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className={s.wrapper}>
      <When condition={filteredCategories.length > 0}>
        <div className={s.section}>
          <p className={s.label}>Категории</p>
          <div className={s.categoryList}>
            <button
              onClick={handleClearCategory}
              className={cn(s.categoryItem, !currentCategory ? s.categoryActive : s.categoryInactive)}
            >
              Все товары
            </button>
            {filteredCategories.map((cat) => (
              <CategoryButton
                key={cat.id}
                category={cat}
                isActive={currentCategory === cat.slug}
                onClick={handleSelectCategory(cat.slug)}
              />
            ))}
          </div>
        </div>
      </When>

      <When condition={filteredTags.length > 0}>
        <div className={s.divider} />
        <div className={s.section}>
          <p className={s.label}>Теги</p>
          <div className={s.tags}>
            {filteredTags.map((tag) => (
              <TagButton
                key={tag.id}
                tag={tag}
                isActive={currentTags.includes(tag.slug)}
                onClick={handleToggleTag(tag.slug)}
              />
            ))}
          </div>
        </div>
      </When>

      <When condition={!!priceRange}>
        <div className={s.divider} />
        <div className={s.section}>
          <p className={s.label}>Цена</p>
          <PriceRangeSlider
            min={priceRange?.min ?? 0}
            max={priceRange?.max ?? 0}
            value={[
              Number(currentMinPrice ?? priceRange?.min ?? 0),
              Number(currentMaxPrice ?? priceRange?.max ?? 0),
            ]}
            onChange={handlePriceRangeChange}
          />
        </div>
      </When>

      <div className={s.divider} />
      <div className={s.section}>
        <p className={s.label}>Сортировка</p>
        <select
          className={s.sortSelect}
          value={currentSort ?? ''}
          onChange={handleSortChange}
          aria-label="Сортировка"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <When condition={hasFilters}>
        <div className={s.divider} />
        <button className={s.resetButton} onClick={handleReset}>
          Сбросить фильтры
        </button>
      </When>
    </div>
  );
};
