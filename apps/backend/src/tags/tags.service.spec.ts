import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { db } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    tag: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockTag = { id: "tag-1", name: "New", slug: "new", color: "#4361ee" };

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
    it("creates tag when slug and name are unique", async () => {
      (mockDb.tag.findFirst as jest.Mock).mockResolvedValue(null);
      (mockDb.tag.create as jest.Mock).mockResolvedValue(mockTag);

      const result = await service.create({ name: "New", slug: "new" });
      expect(result).toEqual(mockTag);
    });

    it("creates tag with color", async () => {
      (mockDb.tag.findFirst as jest.Mock).mockResolvedValue(null);
      (mockDb.tag.create as jest.Mock).mockResolvedValue(mockTag);

      await service.create({ name: "New", slug: "new", color: "#4361ee" });
      expect(mockDb.tag.create).toHaveBeenCalledWith({
        data: { name: "New", slug: "new", color: "#4361ee" },
      });
    });

    it("throws ConflictException when slug already exists", async () => {
      (mockDb.tag.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockTag)
        .mockResolvedValueOnce(null);
      await expect(service.create({ name: "New", slug: "new" })).rejects.toThrow(ConflictException);
    });

    it("throws ConflictException when name already exists", async () => {
      (mockDb.tag.findFirst as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockTag);
      await expect(service.create({ name: "New", slug: "new-2" })).rejects.toThrow(ConflictException);
    });
  });

  describe("update", () => {
    it("updates tag fields", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);
      (mockDb.tag.update as jest.Mock).mockResolvedValue({ ...mockTag, color: "#ff0000" });

      const result = await service.update("tag-1", { color: "#ff0000" });
      expect(mockDb.tag.update).toHaveBeenCalledWith({
        where: { id: "tag-1" },
        data: { color: "#ff0000" },
      });
      expect(result.color).toBe("#ff0000");
    });

    it("throws NotFoundException for nonexistent tag", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.update("nonexistent", { name: "X" })).rejects.toThrow(NotFoundException);
    });

    it("throws ConflictException when slug is taken by another tag", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);
      (mockDb.tag.findFirst as jest.Mock).mockResolvedValue({ id: "tag-2", slug: "new" });

      await expect(service.update("tag-1", { slug: "new" })).rejects.toThrow(ConflictException);
    });

    it("does not throw when slug belongs to itself", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);
      (mockDb.tag.findFirst as jest.Mock).mockResolvedValue(null);
      (mockDb.tag.update as jest.Mock).mockResolvedValue(mockTag);

      await expect(service.update("tag-1", { slug: "new" })).resolves.not.toThrow();
    });

    it("throws ConflictException when name is taken by another tag", async () => {
      (mockDb.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);
      // Only name is in dto (no slug), so findFirst is called once — for name
      (mockDb.tag.findFirst as jest.Mock).mockResolvedValueOnce({ id: "tag-2", name: "New" });

      await expect(service.update("tag-1", { name: "New" })).rejects.toThrow(ConflictException);
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
