'use client';

import Link from 'next/link';
import { Package, ChevronRight, UserCircle } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMyOrders } from '@/lib/hooks/useOrders';
import { cn } from '@/lib/utils';
import { s } from './page.styled';


const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Профиль', href: '/account/profile' },
  { label: 'Мои заказы' },
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает',
  PROCESSING: 'Обрабатывается',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: s.statusPending,
  PROCESSING: s.statusProcessing,
  SHIPPED: s.statusShipped,
  DELIVERED: s.statusDelivered,
  CANCELLED: s.statusCancelled,
};

const OrdersPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();

  const isLoading = authLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className={`${s.title} mt-6 mb-6`}>Мои заказы</h1>
        <div className={s.list}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className={`${s.skeleton} h-4 w-32 mb-2`} />
                  <div className={`${s.skeleton} h-3 w-24`} />
                </div>
                <div className="text-right">
                  <div className={`${s.skeleton} h-4 w-20 mb-2`} />
                  <div className={`${s.skeleton} h-5 w-24`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={s.page}>
        <div className={s.notAuth}>
          <UserCircle className="h-12 w-12 text-muted-foreground" />
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

      <h1 className={`${s.title} mt-6 mb-6`}>Мои заказы</h1>

      <If condition={!orders || orders.length === 0}>
        <Then>
          <div className={s.empty}>
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className={s.emptyTitle}>Заказов пока нет</p>
            <p className={s.emptyText}>Ваши заказы появятся здесь после оформления</p>
            <Link href="/products">
              <Button>Перейти в каталог</Button>
            </Link>
          </div>
        </Then>
        <Else>
          <div className={s.list}>
            {orders?.map((order) => {
            const itemCount = order.orderItems.reduce((sum, i) => sum + i.quantity, 0);
            const date = new Date(order.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className={s.orderCard}
              >
                <div className={s.orderInfo}>
                  <p className={s.orderNumber}>Заказ #{order.id.slice(-8)}</p>
                  <p className={s.orderDate}>{date}</p>
                </div>
                <div className={s.orderRight}>
                  <p className={s.orderAmount}>${Number(order.totalAmount).toFixed(2)}</p>
                  <p className={s.orderItems}>{itemCount} {itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'}</p>
                </div>
                <Badge className={cn(STATUS_STYLES[order.status])}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </Badge>
                <ChevronRight className={s.orderArrow} />
              </Link>
            );
          })}
          </div>
        </Else>
      </If>
    </div>
  );
};

export default OrdersPage;
