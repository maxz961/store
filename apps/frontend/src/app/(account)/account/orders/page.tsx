'use client';

import Link from 'next/link';
import { Package, UserCircle } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMyOrders } from '@/lib/hooks/useOrders';
import { s } from './page.styled';
import { breadcrumbs } from './page.constants';
import { OrderCard } from './OrderCard';
import { OrderSkeleton } from './OrderSkeleton';


const OrdersPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();

  const isLoading = authLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className={s.pageTitle}>Мои заказы</h1>
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
          <p className={s.notAuthTitle}>Вы не авторизованы</p>
          <p className={s.notAuthText}>Войдите, чтобы увидеть свои заказы</p>
          <Link href="/login">
            <Button>Войти</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <h1 className={s.pageTitle}>Мои заказы</h1>

      <If condition={!orders || orders.length === 0}>
        <Then>
          <div className={s.empty}>
            <Package className={s.emptyIcon} />
            <p className={s.emptyTitle}>Заказов пока нет</p>
            <p className={s.emptyText}>Ваши заказы появятся здесь после оформления</p>
            <Link href="/products">
              <Button>Перейти в каталог</Button>
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
