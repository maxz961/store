import { Injectable } from "@nestjs/common";
import { db, OrderStatus } from "@store/shared";

interface RevenueByCategoryRow {
  categoryName: string;
  revenue: number;
}

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
      revenueByCategoryRaw,
      deliveryMethodDistribution,
      ratingDistribution,
      lowStockProducts,
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

      // Revenue by category (multi-table JOIN — requires raw SQL)
      db.$queryRaw<RevenueByCategoryRow[]>`
        SELECT c.name AS "categoryName", COALESCE(SUM(oi.price * oi.quantity), 0)::float AS revenue
        FROM order_items oi
        JOIN products p ON oi."productId" = p.id
        JOIN categories c ON p."categoryId" = c.id
        JOIN orders o ON oi."orderId" = o.id
        WHERE o.status = 'DELIVERED'
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
      `,

      // Delivery method distribution
      db.order.groupBy({
        by: ["deliveryMethod"],
        _count: { id: true },
      }),

      // Rating distribution (1-5 stars)
      db.review.groupBy({
        by: ["rating"],
        _count: { id: true },
        orderBy: { rating: "asc" },
      }),

      // Low stock products (published, stock < 10)
      db.product.findMany({
        where: { stock: { lt: 10 }, isPublished: true },
        select: { id: true, name: true, nameEn: true, slug: true, stock: true, images: true },
        orderBy: { stock: "asc" },
        take: 10,
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

    // Aggregate revenue by day + compute AOV per day
    const dayMap: Record<string, { revenue: number; count: number }> = {};
    for (const order of revenueByDay) {
      const date = order.createdAt.toISOString().split("T")[0];
      const entry = dayMap[date] ?? { revenue: 0, count: 0 };
      entry.revenue += Number(order.totalAmount);
      entry.count += 1;
      dayMap[date] = entry;
    }
    const revenueByDayArray = Object.entries(dayMap).map(([date, d]) => ({
      date,
      revenue: d.revenue,
    }));
    const aovByDayArray = Object.entries(dayMap)
      .filter(([, d]) => d.count > 0)
      .map(([date, d]) => ({
        date,
        aov: Math.round((d.revenue / d.count) * 100) / 100,
      }));

    const totalRevenue = Number(totalRevenueResult._sum.totalAmount ?? 0);
    const deliveredCount = ordersByStatus.find(
      (s) => s.status === OrderStatus.DELIVERED,
    )?._count.id ?? 0;
    const averageOrderValue = deliveredCount > 0
      ? Math.round((totalRevenue / deliveredCount) * 100) / 100
      : 0;

    return {
      totalRevenue,
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
      revenueByCategory: revenueByCategoryRaw,
      aovByDay: aovByDayArray,
      averageOrderValue,
      deliveryMethodDistribution: deliveryMethodDistribution.map((d) => ({
        method: d.deliveryMethod,
        count: d._count.id,
      })),
      ratingDistribution: ratingDistribution.map((r) => ({
        rating: r.rating,
        count: r._count.id,
      })),
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        nameEn: p.nameEn,
        slug: p.slug,
        stock: p.stock,
        image: p.images[0] ?? null,
      })),
    };
  }
}
