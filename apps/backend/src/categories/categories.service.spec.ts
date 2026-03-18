import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { db } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockCategory = {
  id: "cat-1",
  name: "Electronics",
  slug: "electronics",
  description: null,
  imageUrl: null,
  parentId: null,
  children: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("CategoriesService", () => {
  let service: CategoriesService;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("returns root categories", async () => {
      (mockDb.category.findMany as jest.Mock).mockResolvedValue([mockCategory]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(mockDb.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { parentId: null } })
      );
    });
  });

  describe("create", () => {
    it("creates category when slug and name are unique", async () => {
      (mockDb.category.findFirst as jest.Mock).mockResolvedValue(null);
      (mockDb.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.create({ name: "Electronics", nameEn: "Test EN", slug: "electronics" });
      expect(result).toEqual(mockCategory);
    });

    it("throws ConflictException when slug already exists", async () => {
      (mockDb.category.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce(null);

      await expect(
        service.create({ name: "Electronics", nameEn: "Test EN", slug: "electronics" })
      ).rejects.toThrow(ConflictException);
    });

    it("throws ConflictException when name already exists", async () => {
      (mockDb.category.findFirst as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockCategory);

      await expect(
        service.create({ name: "Electronics", nameEn: "Test EN", slug: "electronics-2" })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("update", () => {
    it("throws NotFoundException for nonexistent category", async () => {
      (mockDb.category.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update("nonexistent", { name: "New Name" })).rejects.toThrow(
        NotFoundException
      );
    });

    it("throws ConflictException when slug is taken by another category", async () => {
      (mockDb.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      (mockDb.category.findFirst as jest.Mock).mockResolvedValue({ id: "cat-2", slug: "electronics" });

      await expect(service.update("cat-1", { slug: "electronics" })).rejects.toThrow(
        ConflictException
      );
    });

    it("does not throw when slug belongs to itself", async () => {
      (mockDb.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      (mockDb.category.findFirst as jest.Mock).mockResolvedValue(null);
      (mockDb.category.update as jest.Mock).mockResolvedValue(mockCategory);

      await expect(service.update("cat-1", { slug: "electronics" })).resolves.not.toThrow();
    });

    it("throws ConflictException when name is taken by another category", async () => {
      (mockDb.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      // Only name is in dto (no slug), so findFirst is called once — for name
      (mockDb.category.findFirst as jest.Mock).mockResolvedValueOnce({ id: "cat-2", name: "Electronics" });

      await expect(service.update("cat-1", { name: "Electronics" })).rejects.toThrow(
        ConflictException
      );
    });
  });
});
