import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { db, OrderStatus, DeliveryMethod } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    product: { findMany: jest.fn(), update: jest.fn() },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  },
  OrderStatus: {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  },
  DeliveryMethod: { COURIER: "COURIER", PICKUP: "PICKUP", POST: "POST" },
}));

const mockProduct = {
  id: "product-1",
  name: "Test Product",
  price: 100,
  stock: 10,
  isPublished: true,
};

const mockOrder = {
  id: "order-1",
  userId: "user-1",
  status: OrderStatus.PENDING,
  totalAmount: 200,
  deliveryMethod: DeliveryMethod.COURIER,
  shippingAddress: { fullName: "John", line1: "123 St", city: "NY", state: "NY", postalCode: "10001", country: "US" },
  orderItems: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("OrdersService", () => {
  let service: OrdersService;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();
    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe("create", () => {
    const dto = {
      deliveryMethod: DeliveryMethod.COURIER,
      shippingAddress: { fullName: "John", line1: "123 St", city: "NY", state: "NY", postalCode: "10001", country: "US" },
      items: [{ productId: "product-1", quantity: 2 }],
    };

    it("creates order successfully", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);
      (mockDb.$transaction as jest.Mock).mockImplementation((fn) =>
        fn({ order: { create: jest.fn().mockResolvedValue(mockOrder) }, product: { update: jest.fn() } })
      );

      const result = await service.create("user-1", dto);
      expect(result).toEqual(mockOrder);
    });

    it("throws BadRequestException for product not found", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);

      await expect(service.create("user-1", dto)).rejects.toThrow(BadRequestException);
    });

    it("throws BadRequestException for insufficient stock", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([
        { ...mockProduct, stock: 1 },
      ]);

      await expect(
        service.create("user-1", { ...dto, items: [{ productId: "product-1", quantity: 5 }] })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateStatus", () => {
    it("updates order status", async () => {
      (mockDb.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
      (mockDb.order.update as jest.Mock).mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.SHIPPED,
      });

      const result = await service.updateStatus("order-1", { status: OrderStatus.SHIPPED });
      expect(result.status).toBe(OrderStatus.SHIPPED);
    });

    it("throws NotFoundException for nonexistent order", async () => {
      (mockDb.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateStatus("nonexistent", { status: OrderStatus.SHIPPED })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAll", () => {
    const mockItems = [{ id: "order-1", status: "PENDING" }];

    beforeEach(() => {
      (mockDb.order.findMany as jest.Mock).mockResolvedValue(mockItems);
      (mockDb.order.count as jest.Mock).mockResolvedValue(1);
    });

    it("returns paginated orders", async () => {
      const result = await service.findAll(1, 20);
      expect(result).toEqual({
        items: mockItems,
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it("handles string page/limit from query params", async () => {
      const result = await service.findAll("2" as unknown as number, "10" as unknown as number);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(mockDb.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });

    it("defaults to page 1 limit 20 when undefined", async () => {
      const result = await service.findAll(undefined, undefined);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(mockDb.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });

    it("filters by status", async () => {
      await service.findAll(1, 20, OrderStatus.PENDING);
      expect(mockDb.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "PENDING" } }),
      );
    });

    it("clamps invalid page to 1", async () => {
      const result = await service.findAll(-5, 20);
      expect(result.page).toBe(1);
    });
  });
});
