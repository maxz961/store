'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AdminPagination } from '@/components/ui/AdminPagination';
import { Spinner } from '@/components/ui/Spinner';
import { useAdminOrders } from '@/lib/hooks/useAdmin';
import { s } from './page.styled';
import { breadcrumbs } from './page.constants';
import { OrderFilterTabs } from './OrderFilterTabs';
import { OrdersTable } from './OrdersTable';


const AdminOrdersContent = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const page = searchParams.get('page') ?? undefined;
  const sortBy = searchParams.get('sortBy') ?? undefined;
  const sortOrder = searchParams.get('sortOrder') ?? undefined;

  const { data, isLoading } = useAdminOrders({
    status: status || undefined,
    page,
    sortBy,
    sortOrder,
  });

  if (isLoading) {
    return <div className="flex justify-center py-24"><Spinner /></div>;
  }

  return (
    <>
      <OrderFilterTabs activeStatus={status} />
      <OrdersTable orders={data?.items ?? []} />
      <AdminPagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        itemLabel="заказов"
      />
    </>
  );
};


const AdminOrdersPage = () => (
  <div className={s.page}>
    <Breadcrumbs items={breadcrumbs} />
    <Suspense fallback={<div className="flex justify-center py-24"><Spinner /></div>}>
      <AdminOrdersContent />
    </Suspense>
  </div>
);

export default AdminOrdersPage;
