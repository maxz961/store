import { api } from "@/lib/api";
import { notFound } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const DELIVERY_LABELS: Record<string, string> = {
  COURIER: "Courier",
  PICKUP: "Pickup",
  POST: "Post",
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  let order: any;
  try {
    order = await api.get(`/orders/${params.id}`, { cache: "no-store" });
  } catch {
    notFound();
  }

  const address = order.shippingAddress as {
    fullName: string; line1: string; city: string; state: string; postalCode: string; country: string;
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-2 text-2xl font-bold">Order #{order.id.slice(-8)}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="mb-6 flex gap-4">
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm">
          {DELIVERY_LABELS[order.deliveryMethod] ?? order.deliveryMethod}
        </span>
      </div>

      <div className="mb-6 rounded-lg border p-4">
        <h2 className="mb-2 font-semibold">Shipping Address</h2>
        <p className="text-sm text-muted-foreground">
          {address.fullName}<br />
          {address.line1}<br />
          {address.city}, {address.state} {address.postalCode}, {address.country}
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 font-semibold">Items</h2>
        <div className="space-y-3">
          {order.orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t pt-3 font-bold">
          <span>Total</span>
          <span>${Number(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
