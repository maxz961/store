'use client';

import { use } from 'react';
import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useLanguage } from '@/lib/i18n';
import { useOrder } from '@/lib/hooks/useOrders';
import type { OrderDetailPageProps } from './page.types';
import { s } from './page.styled';
import { OrderDetailSkeleton } from './OrderDetailSkeleton';
import { OrderHeader } from './OrderHeader';
import { OrderStatusMeta } from './OrderStatusMeta';
import { OrderItemsSection } from './OrderItemsSection';
import { OrderAddressSection } from './OrderAddressSection';


const OrderDetailPage = ({ params }: OrderDetailPageProps) => {
  const { id } = use(params);
  const { t } = useLanguage();
  const { data: order, isLoading, error } = useOrder(id);

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('orders.title'), href: '/account/orders' },
    { label: order ? `#${order.id.slice(-8)}` : t('common.loading') },
  ];

  if (isLoading) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <div className={s.loadingSection}>
          <div className={s.skeletonTitle} />
          <div className={s.skeletonDate} />
          <div className={s.skeletonStatus} />
          <div className={s.skeletonCard}>
            {Array.from({ length: 2 }).map((_, i) => (
              <OrderDetailSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={s.page}>
        <div className={s.error}>
          <Package className={s.emptyIcon} />
          <p className={s.errorTitle}>{t('common.notFound')}</p>
          <p className={s.errorText}>{t('common.error')}</p>
          <Link href="/account/orders">
            <Button variant="outline">
              <ArrowLeft className={s.backIcon} />
              {t('orders.backToOrders')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <OrderHeader orderId={order.id} date={date} />
      <OrderStatusMeta status={order.status} deliveryMethod={order.deliveryMethod} />
      <OrderItemsSection items={order.orderItems} totalAmount={order.totalAmount} />
      <OrderAddressSection deliveryMethod={order.deliveryMethod} address={order.shippingAddress} />
    </div>
  );
};

export default OrderDetailPage;
