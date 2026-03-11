import { Test, TestingModule } from "@nestjs/testing";
import { AnalyticsService } from "./analytics.service";
import { db, OrderStatus } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    order: {
      aggregate: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    orderItem: {
      groupBy: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    review: {
      groupBy: jest.fn(),
    },
    $queryRaw: jest.fn(),
  },
  OrderStatus: {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  },
}));

describe("AnalyticsService", () => {
  let service: AnalyticsService;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService],
    }).compile();
    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  function setupDefaultMocks() {
    (mockDb.order.aggregate as jest.Mock).mockResolvedValue({
      _sum: { totalAmount: 3000 },
    });
    (mockDb.order.count as jest.Mock).mockResolvedValue(50);
    (mockDb.order.groupBy as jest.Mock)
      .mockResolvedValueOnce([
        { status: OrderStatus.DELIVERED, _count: { id: 30 } },
        { status: OrderStatus.PENDING, _count: { id: 20 } },
      ])
      .mockResolvedValueOnce([
        { deliveryMethod: "COURIER", _count: { id: 25 } },
        { deliveryMethod: "PICKUP", _count: { id: 15 } },
        { deliveryMethod: "POST", _count: { id: 10 } },
      ]);
    (mockDb.order.findMany as jest.Mock).mockResolvedValue([
      { totalAmount: 500, createdAt: new Date("2026-03-01") },
      { totalAmount: 300, createdAt: new Date("2026-03-01") },
    ]);
    (mockDb.orderItem.groupBy as jest.Mock).mockResolvedValue([
      { productId: "product-1", _sum: { quantity: 15 } },
    ]);
    (mockDb.user.count as jest.Mock).mockResolvedValue(10);
    (mockDb.product.findMany as jest.Mock).mockResolvedValue([
      { id: "product-1", name: "Test Product", slug: "test-product", price: 99.99, stock: 5, images: ["img.jpg"] },
    ]);
    (mockDb.$queryRaw as jest.Mock).mockResolvedValue([
      { categoryName: "Электроника", revenue: 5000 },
      { categoryName: "Одежда", revenue: 3000 },
    ]);
    (mockDb.review.groupBy as jest.Mock).mockResolvedValue([
      { rating: 1, _count: { id: 2 } },
      { rating: 3, _count: { id: 5 } },
      { rating: 5, _count: { id: 10 } },
    ]);
  }

  describe("getSummary", () => {
    it("returns analytics summary with all fields", async () => {
      setupDefaultMocks();

      const result = await service.getSummary();

      expect(result).toMatchObject({
        totalRevenue: 3000,
        ordersCount: 50,
        ordersThisMonth: 50,
        ordersByStatus: expect.arrayContaining([
          expect.objectContaining({ status: OrderStatus.DELIVERED, count: 30 }),
        ]),
        topProducts: expect.arrayContaining([
          expect.objectContaining({ soldCount: 15 }),
        ]),
        newUsersThisMonth: 10,
        revenueByDay: expect.any(Array),
        revenueByCategory: expect.any(Array),
        aovByDay: expect.any(Array),
        averageOrderValue: expect.any(Number),
        deliveryMethodDistribution: expect.any(Array),
        ratingDistribution: expect.any(Array),
        lowStockProducts: expect.any(Array),
      });
    });

    it("returns revenue by category from raw SQL", async () => {
      setupDefaultMocks();

      const result = await service.getSummary();

      expect(result.revenueByCategory).toEqual([
        { categoryName: "Электроника", revenue: 5000 },
        { categoryName: "Одежда", revenue: 3000 },
      ]);
    });

    it("returns delivery method distribution", async () => {
      setupDefaultMocks();

      const result = await service.getSummary();

      expect(result.deliveryMethodDistribution).toEqual([
        { method: "COURIER", count: 25 },
        { method: "PICKUP", count: 15 },
        { method: "POST", count: 10 },
      ]);
    });

    it("returns rating distribution", async () => {
      setupDefaultMocks();

      const result = await service.getSummary();

      expect(result.ratingDistribution).toEqual([
        { rating: 1, count: 2 },
        { rating: 3, count: 5 },
        { rating: 5, count: 10 },
      ]);
    });

    it("computes AOV by day from delivered orders", async () => {
      setupDefaultMocks();
      (mockDb.order.findMany as jest.Mock).mockResolvedValue([
        { totalAmount: 500, createdAt: new Date("2026-03-01") },
        { totalAmount: 300, createdAt: new Date("2026-03-01") },
        { totalAmount: 200, createdAt: new Date("2026-03-02") },
      ]);

      const result = await service.getSummary();

      const day1 = result.aovByDay.find((d) => d.date === "2026-03-01");
      expect(day1?.aov).toBe(400); // (500 + 300) / 2

      const day2 = result.aovByDay.find((d) => d.date === "2026-03-02");
      expect(day2?.aov).toBe(200); // 200 / 1
    });

    it("computes overall average order value from delivered orders", async () => {
      setupDefaultMocks();

      const result = await service.getSummary();

      // totalRevenue = 3000, delivered count = 30
      expect(result.averageOrderValue).toBe(100);
    });

    it("returns low stock products with first image", async () => {
      setupDefaultMocks();
      (mockDb.product.findMany as jest.Mock)
        .mockReset()
        .mockResolvedValueOnce([ // low stock (in Promise.all)
          { id: "p1", name: "Товар A", slug: "tovar-a", stock: 3, images: ["img1.jpg", "img2.jpg"] },
          { id: "p2", name: "Товар B", slug: "tovar-b", stock: 0, images: [] },
        ])
        .mockResolvedValueOnce([]); // top product details (after Promise.all)

      const result = await service.getSummary();

      expect(result.lowStockProducts).toEqual([
        { id: "p1", name: "Товар A", slug: "tovar-a", stock: 3, image: "img1.jpg" },
        { id: "p2", name: "Товар B", slug: "tovar-b", stock: 0, image: null },
      ]);
    });

    it("handles zero data gracefully", async () => {
      (mockDb.order.aggregate as jest.Mock).mockResolvedValue({ _sum: { totalAmount: null } });
      (mockDb.order.count as jest.Mock).mockResolvedValue(0);
      (mockDb.order.groupBy as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      (mockDb.order.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.orderItem.groupBy as jest.Mock).mockResolvedValue([]);
      (mockDb.user.count as jest.Mock).mockResolvedValue(0);
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.$queryRaw as jest.Mock).mockResolvedValue([]);
      (mockDb.review.groupBy as jest.Mock).mockResolvedValue([]);

      const result = await service.getSummary();

      expect(result.totalRevenue).toBe(0);
      expect(result.averageOrderValue).toBe(0);
      expect(result.revenueByDay).toEqual([]);
      expect(result.aovByDay).toEqual([]);
      expect(result.topProducts).toEqual([]);
      expect(result.revenueByCategory).toEqual([]);
      expect(result.deliveryMethodDistribution).toEqual([]);
      expect(result.ratingDistribution).toEqual([]);
      expect(result.lowStockProducts).toEqual([]);
    });
  });
});
