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


const AdminProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) => {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.page) params.set('page', sp.page);
  if (sp.search) params.set('search', sp.search);

  const data = await api.get<ProductsResponse>(`/products/admin?${params.toString()}`, { cache: 'no-store' });
  const currentPage = data.page;

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.header}>
        <h1 className={s.title}>Товары</h1>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className={s.buttonIcon} />
            Добавить товар
          </Button>
        </Link>
      </div>

      <ProductsTable products={data.items} />
      <ProductsPagination currentPage={currentPage} totalPages={data.totalPages} total={data.total} />
    </div>
  );
};

export default AdminProductsPage;
