import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { db } from '@store/shared';

jest.mock('@store/shared', () => ({
  db: {
    favorite: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  },
}));

const mockProduct = {
  id: 'prod-1',
  name: 'Test Product',
  slug: 'test-product',
  price: '100.00',
  images: [],
  stock: 10,
  isPublished: true,
  category: { name: 'Electronics' },
};

const mockFavorite = {
  id: 'fav-1',
  userId: 'user-1',
  productId: 'prod-1',
  createdAt: new Date(),
  product: mockProduct,
};

describe('FavoritesService', () => {
  let service: FavoritesService;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritesService],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    jest.clearAllMocks();
  });

  describe('findAllForUser', () => {
    it('returns favorites list for user', async () => {
      (mockDb.favorite.findMany as jest.Mock).mockResolvedValue([mockFavorite]);

      const result = await service.findAllForUser('user-1');

      expect(result).toHaveLength(1);
      expect(mockDb.favorite.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
    });
  });

  describe('getProductIds', () => {
    it('returns array of product IDs', async () => {
      (mockDb.favorite.findMany as jest.Mock).mockResolvedValue([
        { productId: 'prod-1' },
        { productId: 'prod-2' },
      ]);

      const result = await service.getProductIds('user-1');

      expect(result).toEqual(['prod-1', 'prod-2']);
    });
  });

  describe('add', () => {
    it('adds product to favorites and returns updated ids', async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockDb.favorite.count as jest.Mock).mockResolvedValue(0);
      (mockDb.favorite.upsert as jest.Mock).mockResolvedValue(mockFavorite);
      (mockDb.favorite.findMany as jest.Mock).mockResolvedValue([{ productId: 'prod-1' }]);

      const result = await service.add('user-1', 'prod-1');

      expect(result).toEqual({ ids: ['prod-1'] });
      expect(mockDb.favorite.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: { userId: 'user-1', productId: 'prod-1' },
        }),
      );
    });

    it('throws NotFoundException when product does not exist', async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.add('user-1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when limit of 50 is reached', async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockDb.favorite.count as jest.Mock).mockResolvedValue(50);

      await expect(service.add('user-1', 'prod-1')).rejects.toThrow(BadRequestException);
    });

    it('does not throw when user has exactly 49 favorites', async () => {
      (mockDb.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (mockDb.favorite.count as jest.Mock).mockResolvedValue(49);
      (mockDb.favorite.upsert as jest.Mock).mockResolvedValue(mockFavorite);
      (mockDb.favorite.findMany as jest.Mock).mockResolvedValue([{ productId: 'prod-1' }]);

      await expect(service.add('user-1', 'prod-1')).resolves.not.toThrow();
    });
  });

  describe('remove', () => {
    it('removes product from favorites and returns updated ids', async () => {
      (mockDb.favorite.findUnique as jest.Mock).mockResolvedValue(mockFavorite);
      (mockDb.favorite.delete as jest.Mock).mockResolvedValue(mockFavorite);
      (mockDb.favorite.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.remove('user-1', 'prod-1');

      expect(result).toEqual({ ids: [] });
      expect(mockDb.favorite.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_productId: { userId: 'user-1', productId: 'prod-1' } },
        }),
      );
    });

    it('throws NotFoundException when favorite does not exist', async () => {
      (mockDb.favorite.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('user-1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
