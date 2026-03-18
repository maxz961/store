'use client';

import { useState, useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from './ProductFilters';
import { FiltersDrawer } from './FiltersDrawer';
import { CatalogPagination } from './CatalogPagination';
import { useProducts, useCategories, useTags } from '@/lib/hooks/useProducts';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/lib/i18n';
import { s } from './ProductCatalog.styled';


export const ProductCatalog = () => {
  const { get } = useProductParams();
  const { t } = useLanguage();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filters = {
    search: get('search'),
    categorySlug: get('categorySlug'),
    tagSlugs: get('tagSlugs'),
    page: get('page'),
    minPrice: get('minPrice'),
    maxPrice: get('maxPrice'),
    sortBy: get('sortBy'),
    sortOrder: get('sortOrder'),
  };

  const { data, isLoading, isFetching, isError } = useProducts(filters);
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  const handleOpenFilters = useCallback(() => setIsFiltersOpen(true), []);
  const handleCloseFilters = useCallback(() => setIsFiltersOpen(false), []);

  const filterProps = {
    categories,
    tags,
    currentCategory: filters.categorySlug,
    currentTags: filters.tagSlugs?.split(',').filter(Boolean) ?? [],
    currentMinPrice: filters.minPrice,
    currentMaxPrice: filters.maxPrice,
    currentSort: filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}_${filters.sortOrder}` : undefined,
  };

  return (
    <div className={s.layout}>
      <button type="button" className={s.mobileFilterBtn} onClick={handleOpenFilters} aria-label={t('catalog.filters')}>
        <SlidersHorizontal className="h-4 w-4" />
        {t('catalog.filters')}
      </button>

      <aside className={s.sidebar}>
        <ProductFilters {...filterProps} />
      </aside>

      <FiltersDrawer isOpen={isFiltersOpen} onClose={handleCloseFilters}>
        <ProductFilters {...filterProps} />
      </FiltersDrawer>

      <div className={s.content}>
        <When condition={isLoading || isFetching}>
          <div className={s.loadingOverlay}>
            <Spinner />
          </div>
        </When>

        <If condition={isError}>
          <Then>
            <div className={s.error}>
              <p className={s.errorTitle}>{t('common.error')}</p>
              <p className={s.errorText}>{t('catalog.loading')}</p>
            </div>
          </Then>
          <Else>
            <If condition={!data || data.items.length === 0}>
              <Then>
                <When condition={!isLoading}>
                  <div className={s.empty}>
                    <p className={s.emptyTitle}>{t('catalog.noResults')}</p>
                    <p className={s.emptyText}>{t('catalog.noResultsText')}</p>
                  </div>
                </When>
              </Then>
              <Else>
                <div className={s.grid}>
                  {data?.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <When condition={(data?.totalPages ?? 1) > 1}>
                  <CatalogPagination
                    page={Number(filters.page ?? '1')}
                    totalPages={data?.totalPages ?? 1}
                  />
                </When>
              </Else>
            </If>
          </Else>
        </If>
      </div>
    </div>
  );
};
