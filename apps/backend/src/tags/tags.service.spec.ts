import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { db } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    tag: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockTag = { id: "tag-1", name: "New", slug: "new" };

describe("TagsService", () => {
  let service: TagsService;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsService],
    }).compile();
    service = module.get<TagsService>(TagsService);
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("creates tag with unique slug", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(null);
      (mockDb.tag.create as jest.Mock).mockResolvedValue(mockTag);

      const result = await service.create({ name: "New", slug: "new" });
      expect(result).toEqual(mockTag);
    });

    it("throws ConflictException for duplicate slug", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);
      await expect(service.create({ name: "New", slug: "new" })).rejects.toThrow(ConflictException);
    });
  });

  describe("remove", () => {
    it("deletes existing tag", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);
      (mockDb.tag.delete as jest.Mock).mockResolvedValue(mockTag);
      await service.remove("tag-1");
      expect(mockDb.tag.delete).toHaveBeenCalledWith({ where: { id: "tag-1" } });
    });

    it("throws NotFoundException for nonexistent tag", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.remove("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });
});
