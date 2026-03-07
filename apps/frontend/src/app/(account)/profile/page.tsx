import { api } from "@/lib/api";
import Link from "next/link";

export default async function ProfilePage() {
  let user: any;
  let orders: any[] = [];

  try {
    [user, orders] = await Promise.all([
      api.get("/auth/me", { cache: "no-store" }),
      api.get("/orders/my", { cache: "no-store" }),
    ]);
  } catch {
    return (
      <div className="container mx-auto py-8">
        <p>Please <Link href="/login" className="text-primary underline">sign in</Link> to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-8 flex items-center gap-4">
        {user.image && (
          <img src={user.image} alt="" className="h-16 w-16 rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.name ?? "User"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-semibold">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
            >
              <div>
                <p className="font-medium">#{order.id.slice(-8)}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${Number(order.totalAmount).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{order.status}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
