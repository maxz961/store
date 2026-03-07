import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { db } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
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
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(null);
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
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

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
