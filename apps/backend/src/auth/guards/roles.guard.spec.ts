import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from '@store/shared';
import { ROLES_KEY } from '../decorators/roles.decorator';


const mockContext = (userRole: Role | undefined, requiredRoles: Role[] | undefined): ExecutionContext => ({
  getHandler: () => ({}),
  getClass: () => ({}),
  switchToHttp: () => ({
    getRequest: () => ({ user: userRole ? { role: userRole } : undefined }),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);


describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    guard = new RolesGuard(reflector);
  });

  const setup = (required: Role[] | undefined, userRole: Role | undefined) => {
    reflector.getAllAndOverride.mockReturnValue(required);
    return guard.canActivate(mockContext(userRole, required));
  };

  it('allows access when no roles required', () => {
    expect(setup(undefined, Role.CUSTOMER)).toBe(true);
  });

  describe('ADMIN-only endpoints', () => {
    const required = [Role.ADMIN];

    it('allows ADMIN', () => expect(setup(required, Role.ADMIN)).toBe(true));
    it('blocks MANAGER', () => expect(setup(required, Role.MANAGER)).toBe(false));
    it('blocks CUSTOMER', () => expect(setup(required, Role.CUSTOMER)).toBe(false));
    it('blocks unauthenticated', () => expect(setup(required, undefined)).toBe(false));
  });

  describe('ADMIN + MANAGER endpoints (products/categories/tags create/edit)', () => {
    const required = [Role.ADMIN, Role.MANAGER];

    it('allows ADMIN', () => expect(setup(required, Role.ADMIN)).toBe(true));
    it('allows MANAGER', () => expect(setup(required, Role.MANAGER)).toBe(true));
    it('blocks CUSTOMER', () => expect(setup(required, Role.CUSTOMER)).toBe(false));
    it('blocks unauthenticated', () => expect(setup(required, undefined)).toBe(false));
  });
});
