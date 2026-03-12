import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { db } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
  },
}));

const mockProduct = {
  id: "product-1",
  name: "Test Product",
  slug: "test-product",
  description: "Description",
  price: 99.99,
  comparePrice: null,
  images: ["https://example.com/img.jpg"],
  stock: 10,
  sku: null,
  isPublished: true,
  categoryId: "cat-1",
  category: { id: "cat-1", name: "Electronics", slug: "electronics" },
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ProductsService", () => {
  let service: ProductsService;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("returns paginated published products for non-admin", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll({}, false);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockDb.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublished: true }),
        })
      );
    });

    it("includes unpublished products in admin mode", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(1);

      await service.findAll({}, true);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.isPublished).toBeUndefined();
    });

    it("filters by tagSlugs", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ tagSlugs: ["new", "sale"] }, false);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.tags).toEqual({
        some: { tag: { slug: { in: ["new", "sale"] } } },
      });
    });

    it("filters by categorySlug", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ categorySlug: "electronics" }, false);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.category).toEqual({ slug: "electronics" });
    });

    it("filters by search term across name and description", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ search: "laptop" }, false);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.OR).toEqual([
        { name: { contains: "laptop", mode: "insensitive" } },
        { description: { contains: "laptop", mode: "insensitive" } },
      ]);
    });

    it("paginates correctly", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(50);

      const result = await service.findAll({ page: 3, limit: 10 }, false);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.skip).toBe(20);
      expect(call.take).toBe(10);
      expect(result.totalPages).toBe(5);
      expect(result.page).toBe(3);
    });

    it("filters by minPrice only", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ minPrice: 100 }, false);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.price).toEqual({ gte: 100 });
    });

    it("filters by maxPrice only", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ maxPrice: 5000 }, false);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.price).toEqual({ lte: 5000 });
    });

    it("filters by both minPrice and maxPrice without losing gte", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ minPrice: 1000, maxPrice: 50000 }, false);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.price).toEqual({ gte: 1000, lte: 50000 });
    });

    it("ignores empty tagSlugs array", async () => {
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockDb.product.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ tagSlugs: [] }, false);

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.tags).toBeUndefined();
    });
  });

  describe("findBySlug", () => {
    it("returns product when found", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.findBySlug("test-product");
      expect(result).toEqual(mockProduct);
    });

    it("throws NotFoundException when product not found", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findBySlug("nonexistent")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("create", () => {
    it("creates product with valid data", async () => {
      (mockDb.product.findFirst as jest.Mock).mockResolvedValue(null);
      (mockDb.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.create({
        name: "Test Product",
        slug: "test-product",
        description: "Description",
        price: 99.99,
        stock: 10,
        categoryId: "cat-1",
        images: ["https://example.com/img.jpg"],
        isPublished: true,
      });

      expect(result).toEqual(mockProduct);
      expect(mockDb.product.create).toHaveBeenCalledTimes(1);
    });

    it("throws ConflictException when slug already exists", async () => {
      (mockDb.product.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(null);

      await expect(
        service.create({
          name: "Test Product",
          slug: "test-product",
          description: "Desc",
          price: 99.99,
          stock: 10,
          categoryId: "cat-1",
          images: ["https://example.com/img.jpg"],
        })
      ).rejects.toThrow(ConflictException);
    });

    it("throws ConflictException when name already exists", async () => {
      (mockDb.product.findFirst as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockProduct);

      await expect(
        service.create({
          name: "Test Product",
          slug: "test-product-2",
          description: "Desc",
          price: 99.99,
          stock: 10,
          categoryId: "cat-1",
          images: ["https://example.com/img.jpg"],
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("update", () => {
    it("throws ConflictException when slug is taken by another product", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockDb.product.findFirst as jest.Mock).mockResolvedValue({ id: "product-2", slug: "test-product" });

      await expect(service.update("product-1", { slug: "test-product" })).rejects.toThrow(
        ConflictException
      );
    });

    it("does not throw when slug belongs to itself", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockDb.product.findFirst as jest.Mock).mockResolvedValue(null);
      (mockDb.product.update as jest.Mock).mockResolvedValue(mockProduct);

      await expect(service.update("product-1", { slug: "test-product" })).resolves.not.toThrow();
    });

    it("throws ConflictException when name is taken by another product", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      // Only name is in dto (no slug), so findFirst is called once — for name
      (mockDb.product.findFirst as jest.Mock).mockResolvedValueOnce({ id: "product-2", name: "Test Product" });

      await expect(service.update("product-1", { name: "Test Product" })).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("findSimilar", () => {
    it("returns products from the same category excluding current", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue({
        id: "product-1",
        categoryId: "cat-1",
      });
      const similar = [{ ...mockProduct, id: "product-2", slug: "other" }];
      (mockDb.product.findMany as jest.Mock).mockResolvedValue(similar);

      const result = await service.findSimilar("test-product");

      expect(result).toEqual(similar);
      expect(mockDb.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isPublished: true,
            categoryId: "cat-1",
            id: { not: "product-1" },
          }),
        })
      );
    });

    it("throws NotFoundException for nonexistent slug", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findSimilar("nonexistent")).rejects.toThrow(
        NotFoundException
      );
    });

    it("returns only published products", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue({
        id: "product-1",
        categoryId: "cat-1",
      });
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);

      await service.findSimilar("test-product");

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.isPublished).toBe(true);
    });

    it("limits results to 8 by default", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue({
        id: "product-1",
        categoryId: "cat-1",
      });
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);

      await service.findSimilar("test-product");

      const call = (mockDb.product.findMany as jest.Mock).mock.calls[0][0];
      expect(call.take).toBe(8);
    });

    it("returns empty array when no similar products exist", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue({
        id: "product-1",
        categoryId: "cat-1",
      });
      (mockDb.product.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findSimilar("test-product");

      expect(result).toEqual([]);
    });
  });

  describe("reportImageError", () => {
    it("sets hasImageError to true on existing product", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue({ id: "product-1" });
      (mockDb.product.update as jest.Mock).mockResolvedValue({ ...mockProduct, hasImageError: true });

      await service.reportImageError("product-1");

      expect(mockDb.product.update).toHaveBeenCalledWith({
        where: { id: "product-1" },
        data: { hasImageError: true },
      });
    });

    it("throws NotFoundException for nonexistent product", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.reportImageError("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("getImageErrorCount", () => {
    it("returns count of products with hasImageError true", async () => {
      (mockDb.product.count as jest.Mock).mockResolvedValue(3);

      const result = await service.getImageErrorCount();

      expect(result).toEqual({ count: 3 });
      expect(mockDb.product.count).toHaveBeenCalledWith({ where: { hasImageError: true } });
    });

    it("returns zero when no broken products", async () => {
      (mockDb.product.count as jest.Mock).mockResolvedValue(0);

      const result = await service.getImageErrorCount();

      expect(result).toEqual({ count: 0 });
    });
  });

  describe("getPriceRange", () => {
    it("returns min and max price of published products", async () => {
      (mockDb.product.aggregate as jest.Mock).mockResolvedValue({
        _min: { price: 100 },
        _max: { price: 5000 },
      });

      const result = await service.getPriceRange();

      expect(result).toEqual({ min: 100, max: 5000 });
      expect(mockDb.product.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isPublished: true } })
      );
    });

    it("returns zeros when no published products exist", async () => {
      (mockDb.product.aggregate as jest.Mock).mockResolvedValue({
        _min: { price: null },
        _max: { price: null },
      });

      const result = await service.getPriceRange();

      expect(result).toEqual({ min: 0, max: 0 });
    });
  });

  describe("remove", () => {
    it("deletes existing product", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockDb.product.delete as jest.Mock).mockResolvedValue(mockProduct);

      await service.remove("product-1");

      expect(mockDb.product.delete).toHaveBeenCalledWith({
        where: { id: "product-1" },
      });
    });

    it("throws NotFoundException for nonexistent product", async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove("nonexistent")).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
