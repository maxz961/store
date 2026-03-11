import { api } from '@/lib/api';
import { s } from './page.styled';
import type { OrdersResponse } from './page.types';
import { OrderFilterTabs } from './OrderFilterTabs';
import { OrdersTable } from './OrdersTable';
import { OrdersPagination } from './OrdersPagination';


const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) => {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.status) params.set('status', sp.status);
  if (sp.page) params.set('page', sp.page);

  const data = await api.get<OrdersResponse>(`/orders/admin?${params.toString()}`, { cache: 'no-store', server: true });
  const currentPage = data.page;
  const activeStatus = sp.status ?? '';

  return (
    <div className={s.page}>

      <OrderFilterTabs activeStatus={activeStatus} />
      <OrdersTable orders={data.items} />
      <OrdersPagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        total={data.total}
        activeStatus={activeStatus}
      />
    </div>
  );
};

export default AdminOrdersPage;
