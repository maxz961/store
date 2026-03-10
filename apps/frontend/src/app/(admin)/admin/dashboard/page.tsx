import { When } from "react-if";
import { api } from "@/lib/api";

interface AnalyticsSummary {
  totalRevenue: number;
  ordersCount: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersByStatus: { status: string; count: number }[];
  topProducts: { product: { name: string; price: number } | undefined; soldCount: number }[];
  newUsersThisMonth: number;
  revenueByDay: { date: string; revenue: number }[];
}

export default async function DashboardPage() {
  let summary: AnalyticsSummary;
  try {
    summary = await api.get<AnalyticsSummary>("/admin/analytics/summary", {
      cache: "no-store",
    });
  } catch {
    return (
      <div className="container mx-auto py-8">
        <p className="text-destructive">Failed to load analytics. Are you an admin?</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={`$${summary.totalRevenue.toFixed(2)}`} />
        <StatCard label="Total Orders" value={summary.ordersCount} />
        <StatCard label="Orders This Month" value={summary.ordersThisMonth} />
        <StatCard label="New Users This Month" value={summary.newUsersThisMonth} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Orders by Status */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Orders by Status</h2>
          <div className="space-y-2">
            {summary.ordersByStatus.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm">{status}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Products</h2>
          <div className="space-y-2">
            {summary.topProducts.slice(0, 5).map(({ product, soldCount }, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{product?.name ?? "Unknown"}</span>
                <span className="font-medium">{soldCount} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Day */}
      <When condition={summary.revenueByDay.length > 0}>
        <div className="mt-8 rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Revenue (Last 30 Days)</h2>
          <div className="overflow-x-auto">
            <div className="flex items-end gap-1 h-32">
              {summary.revenueByDay.map(({ date, revenue }) => {
                const max = Math.max(...summary.revenueByDay.map((d) => d.revenue));
                const height = max > 0 ? (revenue / max) * 100 : 0;
                return (
                  <div
                    key={date}
                    title={`${date}: $${revenue.toFixed(2)}`}
                    className="flex-1 min-w-[4px] bg-primary rounded-t opacity-80 hover:opacity-100 cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </When>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
