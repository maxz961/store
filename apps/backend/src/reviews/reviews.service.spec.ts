import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { db } from '@store/shared';

jest.mock('@store/shared', () => ({
  db: {
    product: {
      findUnique: jest.fn(),
    },
    review: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockReview = {
  id: 'review-1',
  userId: 'user-1',
  productId: 'product-1',
  rating: 5,
  comment: 'Great product!',
  images: ['https://example.com/photo.jpg'],
  createdAt: new Date(),
  user: { id: 'user-1', name: 'Test User', image: null },
};

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewsService],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a review', async () => {
      (db.product.findUnique as jest.Mock).mockResolvedValue({ id: 'product-1' });
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);
      (db.review.create as jest.Mock).mockResolvedValue(mockReview);

      const result = await service.create('user-1', 'product-1', {
        rating: 5,
        comment: 'Great product!',
        images: ['https://example.com/photo.jpg'],
      });

      expect(result).toEqual(mockReview);
      expect(db.review.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ rating: 5, userId: 'user-1', productId: 'product-1' }),
        }),
      );
    });

    it('should throw NotFoundException if product does not exist', async () => {
      (db.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create('user-1', 'nonexistent', { rating: 5 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if user already reviewed product', async () => {
      (db.product.findUnique as jest.Mock).mockResolvedValue({ id: 'product-1' });
      (db.review.findUnique as jest.Mock).mockResolvedValue(mockReview);

      await expect(
        service.create('user-1', 'product-1', { rating: 4 }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create review with rating 1 (boundary)', async () => {
      (db.product.findUnique as jest.Mock).mockResolvedValue({ id: 'product-1' });
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);
      (db.review.create as jest.Mock).mockResolvedValue({ ...mockReview, rating: 1 });

      const result = await service.create('user-1', 'product-1', { rating: 1 });
      expect(result.rating).toBe(1);
    });

    it('should create review without comment or images', async () => {
      (db.product.findUnique as jest.Mock).mockResolvedValue({ id: 'product-1' });
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);
      (db.review.create as jest.Mock).mockResolvedValue({ ...mockReview, comment: null, images: [] });

      const result = await service.create('user-1', 'product-1', { rating: 5 });
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update own review', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(mockReview);
      (db.review.update as jest.Mock).mockResolvedValue({ ...mockReview, rating: 4 });

      const result = await service.update('user-1', 'review-1', { rating: 4 });
      expect(result.rating).toBe(4);
    });

    it('should throw NotFoundException if review does not exist', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('user-1', 'nonexistent', { rating: 4 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if updating another user\'s review', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(mockReview);

      await expect(
        service.update('user-999', 'review-1', { rating: 4 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete own review', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(mockReview);
      (db.review.delete as jest.Mock).mockResolvedValue(mockReview);

      await service.remove('user-1', 'review-1');
      expect(db.review.delete).toHaveBeenCalledWith({ where: { id: 'review-1' } });
    });

    it('should throw NotFoundException if review does not exist', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('user-1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if deleting another user\'s review', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(mockReview);

      await expect(service.remove('user-999', 'review-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('adminRemove', () => {
    it('should delete any review as admin', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(mockReview);
      (db.review.delete as jest.Mock).mockResolvedValue(mockReview);

      await service.adminRemove('review-1');
      expect(db.review.delete).toHaveBeenCalledWith({ where: { id: 'review-1' } });
    });

    it('should throw NotFoundException if review does not exist', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.adminRemove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('adminReply', () => {
    it('should add admin reply to review', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(mockReview);
      (db.review.update as jest.Mock).mockResolvedValue({
        ...mockReview,
        adminReply: 'Thanks for your feedback!',
        adminReplyAt: new Date(),
      });

      const result = await service.adminReply('review-1', 'Thanks for your feedback!');
      expect(result.adminReply).toBe('Thanks for your feedback!');
      expect(db.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ adminReply: 'Thanks for your feedback!' }),
        }),
      );
    });

    it('should throw NotFoundException if review does not exist', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.adminReply('nonexistent', 'reply')).rejects.toThrow(NotFoundException);
    });
  });

  describe('adminRemoveReply', () => {
    it('should remove admin reply from review', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue({ ...mockReview, adminReply: 'old reply' });
      (db.review.update as jest.Mock).mockResolvedValue({ ...mockReview, adminReply: null, adminReplyAt: null });

      const result = await service.adminRemoveReply('review-1');
      expect(result.adminReply).toBeNull();
      expect(db.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { adminReply: null, adminReplyAt: null },
        }),
      );
    });

    it('should throw NotFoundException if review does not exist', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.adminRemoveReply('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByProductId', () => {
    it('should return reviews for a product sorted by newest', async () => {
      (db.review.findMany as jest.Mock).mockResolvedValue([mockReview]);

      const result = await service.findByProductId('product-1');
      expect(result).toHaveLength(1);
      expect(db.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { productId: 'product-1' },
          orderBy: { createdAt: 'desc' },
        }),
      );
    });

    it('should sort by highest rating', async () => {
      (db.review.findMany as jest.Mock).mockResolvedValue([mockReview]);

      await service.findByProductId('product-1', 'highest');
      expect(db.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { rating: 'desc' } }),
      );
    });

    it('should sort by lowest rating', async () => {
      (db.review.findMany as jest.Mock).mockResolvedValue([mockReview]);

      await service.findByProductId('product-1', 'lowest');
      expect(db.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { rating: 'asc' } }),
      );
    });

    it('should fallback to newest for invalid sort', async () => {
      (db.review.findMany as jest.Mock).mockResolvedValue([mockReview]);

      await service.findByProductId('product-1', 'invalid');
      expect(db.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
    });
  });

  describe('getUserReview', () => {
    it('should return user review for a product', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(mockReview);

      const result = await service.getUserReview('user-1', 'product-1');
      expect(result).toEqual(mockReview);
    });

    it('should return null if user has no review', async () => {
      (db.review.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.getUserReview('user-1', 'product-1');
      expect(result).toBeNull();
    });
  });
});
