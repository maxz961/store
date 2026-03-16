import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { PromotionsService } from "./promotions.service";
import { db } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    promotion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPromotion = {
  id: "promo-1",
  title: "Весенняя распродажа",
  slug: "spring-sale",
  description: "Скидки до 25%",
  bannerImageUrl: "https://example.com/banner.jpg",
  bannerBgColor: "#e8f5e9",
  startDate: new Date("2026-03-01"),
  endDate: new Date("2026-04-30"),
  discountType: "PERCENTAGE",
  discountValue: 25,
  isActive: true,
  position: 0,
  link: "/products?tagSlugs=sale",
  createdAt: new Date(),
  updatedAt: new Date(),
  products: [],
};

describe("PromotionsService", () => {
  let service: PromotionsService;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionsService],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("returns all promotions ordered by position", async () => {
      (mockDb.promotion.findMany as jest.Mock).mockResolvedValue([mockPromotion]);

      const result = await service.findAll();

      expect(result).toEqual([mockPromotion]);
      expect(mockDb.promotion.findMany).toHaveBeenCalledWith({
        include: expect.any(Object),
        orderBy: { position: "asc" },
      });
    });
  });

  describe("findActive", () => {
    it("returns only active promotions within date range", async () => {
      (mockDb.promotion.findMany as jest.Mock).mockResolvedValue([mockPromotion]);

      const result = await service.findActive();

      expect(result).toEqual([mockPromotion]);
      expect(mockDb.promotion.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          startDate: { lte: expect.any(Date) },
          endDate: { gte: expect.any(Date) },
        },
        orderBy: { position: "asc" },
      });
    });

    it("returns empty array when no active promotions", async () => {
      (mockDb.promotion.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findActive();

      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("returns promotion when found", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(mockPromotion);

      const result = await service.findById("promo-1");

      expect(result).toEqual(mockPromotion);
    });

    it("throws NotFoundException when not found", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findById("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findBySlug", () => {
    it("returns active promotion when found by slug", async () => {
      (mockDb.promotion.findFirst as jest.Mock).mockResolvedValue(mockPromotion);

      const result = await service.findBySlug("summer-sale");

      expect(result).toEqual(mockPromotion);
      expect(mockDb.promotion.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ slug: "summer-sale", isActive: true }),
        }),
      );
    });

    it("throws NotFoundException when promotion not found or inactive", async () => {
      (mockDb.promotion.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.findBySlug("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    const dto = {
      title: "New Promo",
      slug: "new-promo",
      bannerImageUrl: "https://example.com/banner.jpg",
      startDate: "2026-03-01T00:00:00.000Z",
      endDate: "2026-04-30T00:00:00.000Z",
      discountType: "PERCENTAGE" as const,
      discountValue: 15,
    };

    it("creates promotion with valid data", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(null);
      (mockDb.promotion.create as jest.Mock).mockResolvedValue(mockPromotion);

      const result = await service.create(dto);

      expect(result).toEqual(mockPromotion);
      expect(mockDb.promotion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "New Promo",
          slug: "new-promo",
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        }),
        include: expect.any(Object),
      });
    });

    it("throws ConflictException when slug exists", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(mockPromotion);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it("creates with productIds join records", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(null);
      (mockDb.promotion.create as jest.Mock).mockResolvedValue(mockPromotion);

      await service.create({ ...dto, productIds: ["p1", "p2"] });

      expect(mockDb.promotion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          products: {
            create: [{ productId: "p1" }, { productId: "p2" }],
          },
        }),
        include: expect.any(Object),
      });
    });
  });

  describe("update", () => {
    it("updates existing promotion", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(mockPromotion);
      (mockDb.promotion.update as jest.Mock).mockResolvedValue(mockPromotion);

      const result = await service.update("promo-1", { title: "Updated" });

      expect(result).toEqual(mockPromotion);
      expect(mockDb.promotion.update).toHaveBeenCalledWith({
        where: { id: "promo-1" },
        data: expect.objectContaining({ title: "Updated" }),
        include: expect.any(Object),
      });
    });

    it("handles productIds replacement", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(mockPromotion);
      (mockDb.promotion.update as jest.Mock).mockResolvedValue(mockPromotion);

      await service.update("promo-1", { productIds: ["p3"] });

      expect(mockDb.promotion.update).toHaveBeenCalledWith({
        where: { id: "promo-1" },
        data: expect.objectContaining({
          products: {
            deleteMany: {},
            create: [{ productId: "p3" }],
          },
        }),
        include: expect.any(Object),
      });
    });

    it("throws NotFoundException for nonexistent promotion", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update("nonexistent", { title: "X" })).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("deletes existing promotion", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(mockPromotion);
      (mockDb.promotion.delete as jest.Mock).mockResolvedValue(mockPromotion);

      await service.remove("promo-1");

      expect(mockDb.promotion.delete).toHaveBeenCalledWith({ where: { id: "promo-1" } });
    });

    it("throws NotFoundException for nonexistent promotion", async () => {
      (mockDb.promotion.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });
});
