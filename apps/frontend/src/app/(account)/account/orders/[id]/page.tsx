'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useOrder } from '@/lib/hooks/useOrders';
import { cn } from '@/lib/utils';
import { s } from './page.styled';


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

const DELIVERY_LABELS: Record<string, string> = {
  COURIER: 'Курьер',
  PICKUP: 'Самовывоз',
  POST: 'Почта',
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const OrderDetailPage = ({ params }: OrderDetailPageProps) => {
  const { id } = use(params);
  const { data: order, isLoading, error } = useOrder(id);

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Мои заказы', href: '/account/orders' },
    { label: order ? `#${order.id.slice(-8)}` : 'Загрузка...' },
  ];

  if (isLoading) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-6">
          <div className={`${s.skeleton} h-7 w-64 mb-2`} />
          <div className={`${s.skeleton} h-4 w-40 mb-4`} />
          <div className={`${s.skeleton} h-6 w-24 mb-8`} />
          <div className="rounded-xl border border-border bg-card">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-5 border-b border-border last:border-0">
                <div className={`${s.skeleton} h-14 w-14 rounded-lg`} />
                <div className="flex-1">
                  <div className={`${s.skeleton} h-4 w-48 mb-2`} />
                  <div className={`${s.skeleton} h-3 w-20`} />
                </div>
                <div className={`${s.skeleton} h-4 w-16`} />
              </div>
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
          <Package className="h-12 w-12 text-muted-foreground" />
          <p className={s.errorTitle}>Заказ не найден</p>
          <p className={s.errorText}>Возможно, заказ был удалён или вы не имеете к нему доступа</p>
          <Link href="/account/orders">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              К заказам
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(order.createdAt).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const address = order.shippingAddress;

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 mb-2 flex items-center gap-3">
        <Link href="/account/orders">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className={s.title}>Заказ #{order.id.slice(-8)}</h1>
      </div>
      <p className={s.subtitle}>{date}</p>

      <div className={s.meta}>
        <Badge className={cn(STATUS_STYLES[order.status])}>
          {STATUS_LABELS[order.status] ?? order.status}
        </Badge>
        <Badge className={s.deliveryBadge}>
          {DELIVERY_LABELS[order.deliveryMethod] ?? order.deliveryMethod}
        </Badge>
      </div>

      {/* Товары */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <p className={s.sectionTitle}>Товары</p>
        </div>
        <div className={s.sectionBody}>
          {order.orderItems.map((item) => (
            <div key={item.id} className={s.item}>
              <div className={s.itemImageWrapper}>
                <If condition={!!item.product.images[0]}>
                  <Then>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className={s.itemImage}
                      sizes="56px"
                    />
                  </Then>
                  <Else>
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Нет фото
                    </div>
                  </Else>
                </If>
              </div>
              <div className={s.itemInfo}>
                <Link
                  href={`/products/${item.product.slug}`}
                  className={`${s.itemName} hover:text-primary transition-colors duration-150`}
                >
                  {item.product.name}
                </Link>
                <p className={s.itemQuantity}>{item.quantity} шт. × ${Number(item.price).toFixed(2)}</p>
              </div>
              <span className={s.itemPrice}>
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className={s.totalRow}>
          <span className={s.totalLabel}>Итого</span>
          <span className={s.totalAmount}>${Number(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>

      {/* Адрес доставки */}
      <When condition={order.deliveryMethod !== 'PICKUP' && !!address}>
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <p className={s.sectionTitle}>Адрес доставки</p>
          </div>
          <div className={s.sectionBody}>
            <p className={s.addressText}>
              {address.fullName}<br />
              {address.line1}<br />
              {address.city}, {address.state} {address.postalCode}<br />
              {address.country}
            </p>
          </div>
        </div>
      </When>
    </div>
  );
};

export default OrderDetailPage;
