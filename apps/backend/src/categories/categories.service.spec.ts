import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { db } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
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
    it("creates category with unique slug", async () => {
      (mockDb.category.findUnique as jest.Mock).mockResolvedValue(null);
      (mockDb.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.create({ name: "Electronics", slug: "electronics" });
      expect(result).toEqual(mockCategory);
    });

    it("throws ConflictException for duplicate slug", async () => {
      (mockDb.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

      await expect(
        service.create({ name: "Electronics", slug: "electronics" })
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
  });
});
