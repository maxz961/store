import Link from 'next/link';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { s } from './page.styled';
import type { ProductsResponse } from './page.types';
import { breadcrumbs } from './page.constants';
import { ProductsTable } from './ProductsTable';
import { ProductsPagination } from './ProductsPagination';
import { ProductSearch } from './ProductSearch';
import { ProductsViewSwitch } from './ProductsViewSwitch';


const AdminProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; sortBy?: string; sortOrder?: string; view?: string }>;
}) => {
  const sp = await searchParams;
  const sortBy = sp.sortBy ?? 'createdAt';
  const sortOrder = (sp.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const view = sp.view === 'broken' ? 'broken' : 'all';

  const params = new URLSearchParams();
  if (sp.page) params.set('page', sp.page);
  if (sp.search) params.set('search', sp.search);
  params.set('sortBy', sortBy);
  params.set('sortOrder', sortOrder);
  if (view === 'broken') params.set('imageError', 'true');

  const [data, imageErrorData] = await Promise.all([
    api.get<ProductsResponse>(`/products/admin?${params.toString()}`, { cache: 'no-store', server: true }),
    api.get<{ count: number }>('/products/admin/image-error-count', { cache: 'no-store', server: true }).catch(() => ({ count: 0 })),
  ]);

  const currentPage = data.page;

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.header}>
        <ProductSearch defaultValue={sp.search} sortBy={sortBy} sortOrder={sortOrder} />
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className={s.buttonIcon} />
            Добавить товар
          </Button>
        </Link>
      </div>

      <ProductsViewSwitch currentView={view} imageErrorCount={imageErrorData.count} />

      <ProductsTable
        products={data.items}
        sortBy={sortBy}
        sortOrder={sortOrder}
        search={sp.search}
      />
      <ProductsPagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        search={sp.search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        view={view}
      />
    </div>
  );
};

export default AdminProductsPage;
