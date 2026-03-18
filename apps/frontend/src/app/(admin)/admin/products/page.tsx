'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/lib/i18n';
import { useAdminProducts, useImageErrorCount } from '@/lib/hooks/useAdmin';
import { s } from './page.styled';
import type { SortOrder } from './page.types';
import { ProductsTable } from './ProductsTable';
import { ProductsPagination } from './ProductsPagination';
import { ProductSearch } from './ProductSearch';
import { ProductsViewSwitch } from './ProductsViewSwitch';


const AdminProductsContent = () => {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc') as SortOrder;
  const view = searchParams.get('view') === 'broken' ? 'broken' : 'all';
  const page = searchParams.get('page') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const { t } = useLanguage();

  const { data, isLoading } = useAdminProducts({
    page,
    search,
    sortBy,
    sortOrder,
    imageError: view === 'broken',
  });
  const { data: imageErrorData } = useImageErrorCount();

  if (isLoading) {
    return <div className="flex justify-center py-24"><Spinner /></div>;
  }

  return (
    <>
      <div className={s.viewRow}>
        <ProductsViewSwitch currentView={view} imageErrorCount={imageErrorData?.count ?? 0} />
        <ProductSearch defaultValue={search} sortBy={sortBy} sortOrder={sortOrder} />
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className={s.buttonIcon} />
            {t('admin.products.addProduct')}
          </Button>
        </Link>
      </div>

      <ProductsTable
        products={data?.items ?? []}
        sortBy={sortBy}
        sortOrder={sortOrder}
        search={search}
      />
      <ProductsPagination
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        view={view}
      />
    </>
  );
};


const AdminProductsPage = () => {
  const { t } = useLanguage();
  const breadcrumbs = useMemo(() => [
    { label: t('nav.admin'), href: '/admin/dashboard' },
    { label: t('admin.dashboard.products') },
  ], [t]);

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <Suspense fallback={<div className="flex justify-center py-24"><Spinner /></div>}>
        <AdminProductsContent />
      </Suspense>
    </div>
  );
};

export default AdminProductsPage;
