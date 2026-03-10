'use client';

import { If, Then, Else, When } from 'react-if';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { useProducts, useCategories, useTags } from '@/lib/hooks/useProducts';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { Spinner } from '@/components/ui/Spinner';
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
        <When condition={isLoading || isFetching}>
          <div className={s.loadingOverlay}>
            <Spinner />
          </div>
        </When>

        <If condition={isError}>
          <Then>
            <div className={s.error}>
              <p className={s.errorTitle}>Ошибка загрузки</p>
              <p className={s.errorText}>Не удалось загрузить товары</p>
            </div>
          </Then>
          <Else>
            <If condition={!data || data.items.length === 0}>
              <Then>
                <When condition={!isLoading}>
                  <div className={s.empty}>
                    <p className={s.emptyTitle}>Товары не найдены</p>
                    <p className={s.emptyText}>Попробуйте изменить фильтры</p>
                  </div>
                </When>
              </Then>
              <Else>
                <div className={s.grid}>
                  {data?.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </Else>
            </If>
          </Else>
        </If>
      </div>
    </div>
  );
};
