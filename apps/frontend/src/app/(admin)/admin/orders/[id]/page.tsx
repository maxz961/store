'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useAdminOrder, useUpdateOrderStatus } from '@/lib/hooks/useAdmin';
import { s } from './page.styled';
import { formatDate } from '@/lib/constants/format';
import { StatusSection } from './StatusSection';
import { DeliveryCard } from './DeliveryCard';
import { AddressCard } from './AddressCard';
import { OrderItemsList } from './OrderItemsList';

const AdminOrderDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: order, isLoading, isError } = useAdminOrder(params.id);
  const updateStatus = useUpdateOrderStatus(params.id);

  const handleUpdateStatus = useCallback((status: string) => () => {
    updateStatus.mutate(status);
  }, [updateStatus]);

  if (isError) {
    router.push('/admin/orders');
    return null;
  }

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={`${s.skeleton} h-8 w-48`} />
        <div className={`${s.skeleton} mt-6 h-24`} />
        <div className={`${s.skeleton} mt-6 h-48`} />
      </div>
    );
  }

  if (!order) return null;

  const breadcrumbs = [
    { label: 'Админ-панель', href: '/admin/dashboard' },
    { label: 'Заказы', href: '/admin/orders' },
    { label: `#${order.id.slice(-8)}` },
  ];

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <Link href="/admin/orders" className={s.backLink}>
        <ArrowLeft className="h-4 w-4" />
        Назад к заказам
      </Link>

      <div className="flex items-center gap-3">
        <h1 className={s.title}>Заказ #{order.id.slice(-8)}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className={s.subtitle}>
        {order.user?.name ?? order.user?.email ?? '—'} · {formatDate(order.createdAt, 'long')}
      </p>

      <StatusSection
        orderStatus={order.status}
        onUpdateStatus={handleUpdateStatus}
        isPending={updateStatus.isPending}
      />

      <div className={s.infoGrid}>
        <DeliveryCard deliveryMethod={order.deliveryMethod} />
        <AddressCard address={order.shippingAddress} />
      </div>

      <OrderItemsList items={order.orderItems} totalAmount={Number(order.totalAmount)} />
    </div>
  );
};

export default AdminOrderDetailPage;
