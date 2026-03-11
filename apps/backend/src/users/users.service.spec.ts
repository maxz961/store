import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
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
  isBanned: false,
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

  describe("updateRole", () => {
    it("updates user role", async () => {
      const updated = { ...mockUser, role: Role.ADMIN };
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockDb.user.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateRole("user-1", Role.ADMIN, "admin-1");

      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { role: Role.ADMIN },
      });
      expect(result.role).toBe(Role.ADMIN);
    });

    it("throws ForbiddenException when changing own role", async () => {
      await expect(
        service.updateRole("user-1", Role.ADMIN, "user-1"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws NotFoundException when user not found", async () => {
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        service.updateRole("nonexistent", Role.ADMIN, "admin-1"),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("setBanned", () => {
    it("bans a customer", async () => {
      const banned = { ...mockUser, isBanned: true };
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockDb.user.update as jest.Mock).mockResolvedValue(banned);

      const result = await service.setBanned("user-1", true, "admin-1");

      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { isBanned: true },
      });
      expect(result.isBanned).toBe(true);
    });

    it("unbans a user", async () => {
      const bannedUser = { ...mockUser, isBanned: true };
      const unbanned = { ...mockUser, isBanned: false };
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(bannedUser);
      (mockDb.user.update as jest.Mock).mockResolvedValue(unbanned);

      const result = await service.setBanned("user-1", false, "admin-1");
      expect(result.isBanned).toBe(false);
    });

    it("throws ForbiddenException when banning yourself", async () => {
      await expect(
        service.setBanned("user-1", true, "user-1"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws ForbiddenException when banning an admin", async () => {
      const adminUser = { ...mockUser, role: Role.ADMIN };
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(adminUser);

      await expect(
        service.setBanned("user-1", true, "other-admin"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws NotFoundException when user not found", async () => {
      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        service.setBanned("nonexistent", true, "admin-1"),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
