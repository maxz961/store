/**
 * Integration smoke-test для PromotionsController.
 * Проверяет что весь стек (Controller → Service → mocked DB) работает.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';

jest.mock('@store/shared', () => ({
  db: {
    promotion: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'promo-1' }),
      update: jest.fn().mockResolvedValue({ id: 'promo-1' }),
      delete: jest.fn().mockResolvedValue({ id: 'promo-1' }),
    },
    promotionProduct: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    $transaction: jest.fn().mockImplementation((cb: any) => cb({
      promotion: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'promo-1' }),
        update: jest.fn().mockResolvedValue({ id: 'promo-1' }),
        delete: jest.fn().mockResolvedValue({ id: 'promo-1' }),
      },
      promotionProduct: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    })),
  },
  Role: { CUSTOMER: 'CUSTOMER', ADMIN: 'ADMIN' },
  OrderStatus: {},
  DeliveryMethod: {},
  DiscountType: { PERCENTAGE: 'PERCENTAGE', FIXED: 'FIXED' },
}));

describe('PromotionsController (smoke)', () => {
  let controller: PromotionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionsController],
      providers: [PromotionsService],
    }).compile();

    controller = module.get<PromotionsController>(PromotionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /promotions/active — returns array', async () => {
    const result = await controller.findActive();
    expect(Array.isArray(result)).toBe(true);
  });

  it('GET /promotions — returns array', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
  });
});
