import { Injectable } from "@nestjs/common";
import { db, OrderStatus } from "@store/shared";

@Injectable()
export class AnalyticsService {
  async getSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRevenueResult,
      ordersCount,
      ordersThisMonth,
      revenueThisMonthResult,
      ordersByStatus,
      topProducts,
      newUsersThisMonth,
      revenueByDay,
    ] = await Promise.all([
      // Total revenue from delivered orders
      db.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { totalAmount: true },
      }),

      // Total order count
      db.order.count(),

      // Orders this month
      db.order.count({ where: { createdAt: { gte: startOfMonth } } }),

      // Revenue this month
      db.order.aggregate({
        where: { status: OrderStatus.DELIVERED, createdAt: { gte: startOfMonth } },
        _sum: { totalAmount: true },
      }),

      // Orders by status
      db.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // Top 10 products by sales volume
      db.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 10,
      }),

      // New users this month
      db.user.count({ where: { createdAt: { gte: startOfMonth } } }),

      // Revenue per day for last 30 days (raw aggregation)
      db.order.findMany({
        where: {
          status: OrderStatus.DELIVERED,
          createdAt: { gte: thirtyDaysAgo },
        },
        select: { totalAmount: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Build product details for top products
    const productIds = topProducts.map((t) => t.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, slug: true, price: true },
    });

    const topProductsWithDetails = topProducts.map((t) => ({
      product: products.find((p) => p.id === t.productId),
      soldCount: t._sum.quantity ?? 0,
    }));

    // Aggregate revenue by day
    const revenueMap: Record<string, number> = {};
    for (const order of revenueByDay) {
      const date = order.createdAt.toISOString().split("T")[0];
      revenueMap[date] = (revenueMap[date] ?? 0) + Number(order.totalAmount);
    }
    const revenueByDayArray = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    return {
      totalRevenue: Number(totalRevenueResult._sum.totalAmount ?? 0),
      ordersCount,
      ordersThisMonth,
      revenueThisMonth: Number(revenueThisMonthResult._sum.totalAmount ?? 0),
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count.id,
      })),
      topProducts: topProductsWithDetails,
      newUsersThisMonth,
      revenueByDay: revenueByDayArray,
    };
  }
}
