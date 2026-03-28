'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCatalog } from './ProductCatalog';
import { PromoBanner } from './PromoBanner';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useCategories } from '@/lib/hooks/useProducts';
import { useLanguage } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import { s } from './page.styled';


export const ProductsPageClient = () => {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('categorySlug');
  const { data: categories = [] } = useCategories();
  const { t, lang } = useLanguage();

  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;

  const catalogLabel = t('catalog.title');
  const breadcrumbs = activeCategory
    ? [{ label: catalogLabel, href: '/products' }, { label: getLocalizedText(lang, activeCategory.name, activeCategory.nameEn) }]
    : [{ label: catalogLabel }];

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <PromoBanner />
      <Suspense>
        <ProductCatalog />
      </Suspense>
    </div>
  );
};
