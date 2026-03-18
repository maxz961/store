import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { Role } from "@store/shared";
import type { User } from "@store/shared";

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

const mockUsersService = {
  findByGoogleId: jest.fn(),
  findByEmail: jest.fn(),
  createFromGoogle: jest.fn(),
  linkGoogleId: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue("mock.jwt.token"),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe("findOrCreateGoogleUser", () => {
    it("returns existing user found by googleId", async () => {
      mockUsersService.findByGoogleId.mockResolvedValue(mockUser);

      const result = await service.findOrCreateGoogleUser({
        googleId: "google-123",
        email: "test@example.com",
        name: "Test User",
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.createFromGoogle).not.toHaveBeenCalled();
    });

    it("finds user by email when googleId lookup returns null", async () => {
      const userWithoutGoogleId = { ...mockUser, googleId: null };
      mockUsersService.findByGoogleId.mockResolvedValue(null);
      mockUsersService.findByEmail.mockResolvedValue(userWithoutGoogleId);
      mockUsersService.linkGoogleId.mockResolvedValue({ ...mockUser, googleId: "google-123" });

      const result = await service.findOrCreateGoogleUser({
        googleId: "google-123",
        email: "test@example.com",
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUsersService.linkGoogleId).toHaveBeenCalledWith(mockUser.id, "google-123");
      expect(result.googleId).toBe("google-123");
    });

    it("creates a new user when no existing user found", async () => {
      mockUsersService.findByGoogleId.mockResolvedValue(null);
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.createFromGoogle.mockResolvedValue(mockUser);

      const result = await service.findOrCreateGoogleUser({
        googleId: "google-new",
        email: "new@example.com",
        name: "New User",
      });

      expect(mockUsersService.createFromGoogle).toHaveBeenCalledWith(
        expect.objectContaining({ email: "new@example.com" })
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("generateJwt", () => {
    it("calls jwtService.sign with correct payload", () => {
      const token = service.generateJwt("user-1", "test@example.com", Role.CUSTOMER);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: "user-1",
        email: "test@example.com",
        role: Role.CUSTOMER,
      });
      expect(token).toBe("mock.jwt.token");
    });
  });
});
