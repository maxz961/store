'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Truck } from 'lucide-react';
import { When } from 'react-if';
import { api } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { cn } from '@/lib/utils';
import { s } from './page.styled';


interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  status: string;
  deliveryMethod: string;
  totalAmount: number;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems: OrderItem[];
  user: { name: string | null; email: string } | null;
}

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает',
  PROCESSING: 'Обрабатывается',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
};

const DELIVERY_LABELS: Record<string, string> = {
  COURIER: 'Курьер',
  PICKUP: 'Самовывоз',
  POST: 'Почта',
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 }).format(value);

const AdminOrderDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get<Order>(`/orders/${params.id}`)
      .then(setOrder)
      .catch(() => router.push('/admin/orders'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleUpdateStatus = useCallback((status: string) => async () => {
    setUpdating(true);
    try {
      const updated = await api.put<Order>(`/orders/${params.id}/status`, { status });
      setOrder(updated);
    } finally {
      setUpdating(false);
    }
  }, [params.id]);

  if (loading) {
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

  const address = order.shippingAddress;

  const statusSection = (
    <div className={s.statusCard}>
      <p className={s.statusTitle}>Статус заказа</p>
      <div className={s.statusButtons}>
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={handleUpdateStatus(status)}
            disabled={updating || order.status === status}
            className={cn(
              s.statusBtn,
              order.status === status ? s.statusBtnActive : s.statusBtnInactive,
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </div>
  );

  const deliveryCard = (
    <div className={s.infoCard}>
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-muted-foreground" />
        <p className={s.infoTitle}>Доставка</p>
      </div>
      <p className={s.infoValue}>{DELIVERY_LABELS[order.deliveryMethod] ?? order.deliveryMethod}</p>
    </div>
  );

  const addressCard = (
    <div className={s.infoCard}>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <p className={s.infoTitle}>Адрес</p>
      </div>
      <p className={s.infoValue}>
        {address.fullName}<br />
        {address.line1}<br />
        {address.city}, {address.state} {address.postalCode}<br />
        {address.country}
      </p>
    </div>
  );

  const itemsList = (
    <div className={s.itemsCard}>
      <p className={s.itemsTitle}>Товары</p>
      <div className="mt-3">
        {order.orderItems.map((item) => (
          <div key={item.id} className={s.itemRow}>
            <div>
              <p className={s.itemName}>{item.product.name}</p>
              <p className={s.itemQty}>{item.quantity} шт. × {formatCurrency(Number(item.price))}</p>
            </div>
            <p className={s.itemPrice}>{formatCurrency(Number(item.price) * item.quantity)}</p>
          </div>
        ))}
      </div>
      <div className={s.totalRow}>
        <span className={s.totalLabel}>Итого</span>
        <span className={s.totalValue}>{formatCurrency(Number(order.totalAmount))}</span>
      </div>
    </div>
  );

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
        {order.user?.name ?? order.user?.email ?? '—'} · {formatDate(order.createdAt)}
      </p>

      {statusSection}

      <div className={s.infoGrid}>
        {deliveryCard}
        {addressCard}
      </div>

      {itemsList}
    </div>
  );
};

export default AdminOrderDetailPage;
