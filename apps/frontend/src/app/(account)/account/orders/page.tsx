'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Package, UserCircle } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMyOrders } from '@/lib/hooks/useOrders';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { breadcrumbs } from './page.constants';
import { OrderCard } from './OrderCard';
import { OrderSkeleton } from './OrderSkeleton';


const OrdersPage = () => {
  const { t } = useLanguage();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();

  const isLoading = authLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <div className={s.list}>
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={s.page}>
        <div className={s.notAuth}>
          <UserCircle className={s.errorIcon} />
          <p className={s.notAuthTitle}>{t('orders.notAuth')}</p>
          <p className={s.notAuthText}>{t('orders.notAuthText')}</p>
          <Link href="/login">
            <Button>{t('orders.login')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <If condition={!orders || orders.length === 0}>
        <Then>
          <div className={s.empty}>
            <Package className={s.emptyIcon} />
            <p className={s.emptyTitle}>{t('orders.empty')}</p>
            <p className={s.emptyText}>{t('orders.emptyText')}</p>
            <Link href="/products">
              <Button>{t('cart.browseCatalog')}</Button>
            </Link>
          </div>
        </Then>
        <Else>
          <div className={s.list}>
            {orders?.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </Else>
      </If>
    </div>
  );
};

export default OrdersPage;
