/**
 * Integration smoke-test для UsersController.
 * Проверяет что весь стек (Controller → Service → mocked DB) работает.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsers = [
  { id: 'u1', email: 'a@b.com', name: 'User A', role: 'CUSTOMER', isBanned: false },
  { id: 'u2', email: 'c@d.com', name: 'User B', role: 'ADMIN', isBanned: false },
];

jest.mock('@store/shared', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([
        { id: 'u1', email: 'a@b.com', name: 'User A', role: 'CUSTOMER', isBanned: false },
        { id: 'u2', email: 'c@d.com', name: 'User B', role: 'ADMIN', isBanned: false },
      ]),
      update: jest.fn(),
    },
  },
  Role: { CUSTOMER: 'CUSTOMER', ADMIN: 'ADMIN' },
}));

describe('UsersController (smoke)', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /users — returns paginated users', async () => {
    const result = await controller.findAll(0, 20);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('PATCH /users/:id/role — calls updateRole', async () => {
    const { db } = jest.requireMock('@store/shared');
    (db.user.findUnique as jest.Mock).mockResolvedValue(mockUsers[0]);
    (db.user.update as jest.Mock).mockResolvedValue({ ...mockUsers[0], role: 'ADMIN' });

    const result = await controller.updateRole(
      'u1',
      { role: 'ADMIN' as any },
      { id: 'admin-1' } as any,
    );
    expect(result.role).toBe('ADMIN');
  });

  it('PATCH /users/:id/ban — calls setBanned', async () => {
    const { db } = jest.requireMock('@store/shared');
    (db.user.findUnique as jest.Mock).mockResolvedValue(mockUsers[0]);
    (db.user.update as jest.Mock).mockResolvedValue({ ...mockUsers[0], isBanned: true });

    const result = await controller.setBanned(
      'u1',
      { isBanned: true },
      { id: 'admin-1' } as any,
    );
    expect(result.isBanned).toBe(true);
  });
});
