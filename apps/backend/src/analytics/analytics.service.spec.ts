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

  describe("getSummary", () => {
    it("returns analytics summary with correct shape", async () => {
      (mockDb.order.aggregate as jest.Mock).mockResolvedValue({ _sum: { totalAmount: 1000 } });
      (mockDb.order.count as jest.Mock).mockResolvedValue(50);
      (mockDb.order.groupBy as jest.Mock).mockResolvedValue([
        { status: OrderStatus.DELIVERED, _count: { id: 30 } },
        { status: OrderStatus.PENDING, _count: { id: 20 } },
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
        { id: "product-1", name: "Test Product", slug: "test-product", price: 99.99 },
      ]);

      const result = await service.getSummary();

      expect(result).toMatchObject({
        totalRevenue: expect.any(Number),
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
      });
    });

    it("handles zero revenue gracefully", async () => {
      (mockDb.order.aggregate as jest.Mock).mockResolvedValue({ _sum: { totalAmount: null } });
      (mockDb.order.count as jest.Mock).mockResolvedValue(0);
      (mockDb.order.groupBy as jest.Mock).mockResolvedValue([]);
      (mockDb.order.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.orderItem.groupBy as jest.Mock).mockResolvedValue([]);
      (mockDb.user.count as jest.Mock).mockResolvedValue(0);
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getSummary();

      expect(result.totalRevenue).toBe(0);
      expect(result.revenueByDay).toEqual([]);
      expect(result.topProducts).toEqual([]);
    });
  });
});
