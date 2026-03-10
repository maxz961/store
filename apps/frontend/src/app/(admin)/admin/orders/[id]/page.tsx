"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";


const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/orders/${params.id}`, { cache: "no-store" })
      .then(setOrder)
      .catch(() => router.push("/admin/orders"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleUpdateStatus = (status: string) => () => updateStatus(status);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const updated = await api.put(`/orders/${params.id}/status`, { status });
      setOrder(updated);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container mx-auto py-8">Loading...</div>;
  if (!order) return null;

  const address = order.shippingAddress;

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-2 text-2xl font-bold">Order #{order.id.slice(-8)}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {order.user?.name ?? order.user?.email} · {new Date(order.createdAt).toLocaleDateString()}
      </p>

      {/* Status Changer */}
      <div className="mb-6 rounded-lg border p-4">
        <h2 className="mb-3 font-semibold">Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={handleUpdateStatus(status)}
              disabled={updating || order.status === status}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                order.status === status
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-accent"
              } disabled:opacity-50`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-lg border p-4">
        <h2 className="mb-2 font-semibold">Delivery: {order.deliveryMethod}</h2>
        <p className="text-sm text-muted-foreground">
          {address.fullName}<br />
          {address.line1}<br />
          {address.city}, {address.state} {address.postalCode}, {address.country}
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 font-semibold">Items</h2>
        {order.orderItems.map((item: any) => (
          <div key={item.id} className="flex justify-between border-b py-2 last:border-0">
            <div>
              <p>{item.product.name}</p>
              <p className="text-sm text-muted-foreground">× {item.quantity}</p>
            </div>
            <p className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t pt-3 font-bold">
          <span>Total</span>
          <span>${Number(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
