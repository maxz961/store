import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { db } from "@store/shared";
import { Role } from "@store/shared";
import type { User } from "@store/shared";

jest.mock("@store/shared", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  },
  Role: { CUSTOMER: "CUSTOMER", ADMIN: "ADMIN" },
}));

const mockUser: User = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  image: null,
  googleId: "google-123",
  role: Role.CUSTOMER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("UsersService", () => {
  let service: UsersService;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("returns user when found", async () => {
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findById("user-1");
      expect(result).toEqual(mockUser);
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({ where: { id: "user-1" } });
    });

    it("returns null when user not found", async () => {
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.findById("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("findOrThrow", () => {
    it("throws NotFoundException when user not found", async () => {
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOrThrow("nonexistent")).rejects.toThrow(
        NotFoundException
      );
    });

    it("returns user when found", async () => {
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findOrThrow("user-1");
      expect(result).toEqual(mockUser);
    });
  });

  describe("createFromGoogle", () => {
    it("creates user with google data", async () => {
      (mockDb.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.createFromGoogle({
        googleId: "google-123",
        email: "test@example.com",
        name: "Test User",
      });

      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "test@example.com",
          googleId: "google-123",
        }),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("linkGoogleId", () => {
    it("links googleId to existing user", async () => {
      const updated = { ...mockUser, googleId: "new-google-id" };
      (mockDb.user.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.linkGoogleId("user-1", "new-google-id");

      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { googleId: "new-google-id" },
      });
      expect(result.googleId).toBe("new-google-id");
    });
  });
});
