/**
 * Integration smoke-test для ProductsController.
 * Проверяет что весь стек (Controller → Service → mocked DB) работает.
 * Ловит: неправильный DI, сломанные DTO, ошибки в controller-layer.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

jest.mock('@store/shared', () => ({
  db: {
    product: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
  Role: { CUSTOMER: 'CUSTOMER', ADMIN: 'ADMIN' },
  OrderStatus: {},
  DeliveryMethod: {},
}));

describe('ProductsController (smoke)', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /products — returns paginated response', async () => {
    const result = await controller.findAll({});
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('totalPages');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('GET /products — page and totalPages are numbers', async () => {
    const result = await controller.findAll({ page: 1, limit: 10 });
    expect(typeof result.page).toBe('number');
    expect(typeof result.totalPages).toBe('number');
  });
});
