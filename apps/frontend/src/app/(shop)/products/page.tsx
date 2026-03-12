'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCatalog } from './ProductCatalog';
import { PromoBanner } from './PromoBanner';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useCategories } from '@/lib/hooks/useProducts';
import { s } from './page.styled';


const ProductsPage = () => {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('categorySlug');
  const { data: categories = [] } = useCategories();

  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;

  const breadcrumbs = activeCategory
    ? [{ label: 'Каталог', href: '/products' }, { label: activeCategory.name }]
    : [{ label: 'Каталог' }];

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

export default ProductsPage;
