import { Suspense } from 'react';
import { ProductCatalog } from '@/components/product/ProductCatalog';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { s } from './page.styled';

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог' },
];

const ProductsPage = () => {
  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <div className={s.header}>
        <h1 className={s.title}>Каталог</h1>
      </div>
      <Suspense>
        <ProductCatalog />
      </Suspense>
    </div>
  );
};

export default ProductsPage;
