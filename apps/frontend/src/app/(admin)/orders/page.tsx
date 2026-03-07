import { api } from "@/lib/api";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.page) params.set("page", searchParams.page);

  const data = await api.get<{
    items: any[];
    total: number;
    page: number;
    totalPages: number;
  }>(`/orders/admin?${params.toString()}`, { cache: "no-store" });

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Orders</h1>

      {/* Status filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
          (status) => (
            <Link
              key={status}
              href={status ? `/admin/orders?status=${status}` : "/admin/orders"}
              className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                (searchParams.status ?? "") === status
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {status || "All"}
            </Link>
          )
        )}
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Delivery</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((order) => (
              <tr key={order.id} className="border-b hover:bg-muted/20">
                <td className="p-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-mono hover:text-primary">
                    #{order.id.slice(-8)}
                  </Link>
                </td>
                <td className="p-3">{order.user?.name ?? order.user?.email ?? "—"}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[order.status] ?? ""}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.deliveryMethod}</td>
                <td className="p-3 text-right">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Page {data.page} of {data.totalPages} · {data.total} total orders
      </p>
    </div>
  );
}
