'use client';

import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { useProducts, useCategories, useTags } from '@/lib/hooks/useProducts';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { s } from './ProductCatalog.styled';

export const ProductCatalog = () => {
  const { get } = useProductParams();

  const filters = {
    search: get('search'),
    categorySlug: get('categorySlug'),
    tagSlugs: get('tagSlugs'),
    page: get('page'),
  };

  const { data, isLoading, isFetching, isError } = useProducts(filters);
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <ProductFilters
          categories={categories}
          tags={tags}
          currentCategory={filters.categorySlug}
          currentTags={filters.tagSlugs?.split(',').filter(Boolean) ?? []}
        />
      </aside>

      <div className={s.content}>
        {(isLoading || isFetching) && (
          <div className={s.loadingOverlay}>
            <div className={s.spinner} />
          </div>
        )}

        {isError ? (
          <div className={s.error}>
            <p className={s.errorTitle}>Ошибка загрузки</p>
            <p className={s.errorText}>Не удалось загрузить товары</p>
          </div>
        ) : !data || data.items.length === 0 ? (
          !isLoading && (
            <div className={s.empty}>
              <p className={s.emptyTitle}>Товары не найдены</p>
              <p className={s.emptyText}>Попробуйте изменить фильтры</p>
            </div>
          )
        ) : (
          <div className={s.grid}>
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
