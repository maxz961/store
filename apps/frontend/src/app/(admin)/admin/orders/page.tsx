import { api } from '@/lib/api';
import { AdminPagination } from '@/components/ui/AdminPagination';
import { s } from './page.styled';
import type { OrdersResponse } from './page.types';
import { OrderFilterTabs } from './OrderFilterTabs';
import { OrdersTable } from './OrdersTable';


const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; sortBy?: string; sortOrder?: string }>;
}) => {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.status) params.set('status', sp.status);
  if (sp.page) params.set('page', sp.page);
  if (sp.sortBy) params.set('sortBy', sp.sortBy);
  if (sp.sortOrder) params.set('sortOrder', sp.sortOrder);

  const data = await api.get<OrdersResponse>(`/orders/admin?${params.toString()}`, { cache: 'no-store', server: true });

  return (
    <div className={s.page}>
      <OrderFilterTabs activeStatus={sp.status ?? ''} />
      <OrdersTable orders={data.items} />
      <AdminPagination
        page={data.page}
        totalPages={data.totalPages}
        total={data.total}
        itemLabel="заказов"
      />
    </div>
  );
};

export default AdminOrdersPage;
