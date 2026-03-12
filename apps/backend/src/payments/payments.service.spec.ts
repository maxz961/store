import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { PaymentsService } from './payments.service';


const mockCreate = jest.fn();

const mockStripe = {
  paymentIntents: {
    create: mockCreate,
  },
};


describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: 'STRIPE', useValue: mockStripe },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  describe('createIntent', () => {
    it('returns clientSecret for valid amount', async () => {
      mockCreate.mockResolvedValue({ client_secret: 'pi_test_secret_123' });

      const result = await service.createIntent(100, 'usd');

      expect(result).toEqual({ clientSecret: 'pi_test_secret_123' });
      expect(mockCreate).toHaveBeenCalledWith({
        amount: 10000,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });
    });

    it('converts amount to cents correctly', async () => {
      mockCreate.mockResolvedValue({ client_secret: 'pi_test_secret' });

      await service.createIntent(99.99, 'usd');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 9999 }),
      );
    });

    it('uses usd as default currency', async () => {
      mockCreate.mockResolvedValue({ client_secret: 'pi_test_secret' });

      await service.createIntent(50);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ currency: 'usd' }),
      );
    });

    it('throws InternalServerErrorException when stripe fails', async () => {
      mockCreate.mockRejectedValue(new Error('Stripe network error'));

      await expect(service.createIntent(100)).rejects.toThrow(InternalServerErrorException);
    });

    it('throws InternalServerErrorException when client_secret is null', async () => {
      mockCreate.mockResolvedValue({ client_secret: null });

      await expect(service.createIntent(100)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
