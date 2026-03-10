export interface AnalyticsSummary {
  totalRevenue: number;
  ordersCount: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersByStatus: { status: string; count: number }[];
  topProducts: { product: { name: string; price: number } | undefined; soldCount: number }[];
  newUsersThisMonth: number;
  revenueByDay: { date: string; revenue: number }[];
}
