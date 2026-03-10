import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { db } from '@store/shared';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

const REVIEW_INCLUDE = {
  user: { select: { id: true, name: true, image: true } },
};

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

const SORT_MAP: Record<SortOption, object> = {
  newest: { createdAt: 'desc' },
  oldest: { createdAt: 'asc' },
  highest: { rating: 'desc' },
  lowest: { rating: 'asc' },
};

@Injectable()
export class ReviewsService {
  async create(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    const existing = await db.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      throw new ConflictException('You already have a review for this product');
    }

    return db.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        comment: dto.comment,
        images: dto.images ?? [],
      },
      include: REVIEW_INCLUDE,
    });
  }

  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await db.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    return db.review.update({
      where: { id: reviewId },
      data: {
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.comment !== undefined && { comment: dto.comment }),
        ...(dto.images !== undefined && { images: dto.images }),
      },
      include: REVIEW_INCLUDE,
    });
  }

  async remove(userId: string, reviewId: string) {
    const review = await db.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await db.review.delete({ where: { id: reviewId } });
  }

  async adminRemove(reviewId: string) {
    const review = await db.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }

    await db.review.delete({ where: { id: reviewId } });
  }

  async adminReply(reviewId: string, reply: string) {
    const review = await db.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }

    return db.review.update({
      where: { id: reviewId },
      data: { adminReply: reply, adminReplyAt: new Date() },
      include: REVIEW_INCLUDE,
    });
  }

  async adminRemoveReply(reviewId: string) {
    const review = await db.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }

    return db.review.update({
      where: { id: reviewId },
      data: { adminReply: null, adminReplyAt: null },
      include: REVIEW_INCLUDE,
    });
  }

  async findByProductId(productId: string, sort: string = 'newest') {
    const orderBy = SORT_MAP[sort as SortOption] ?? SORT_MAP.newest;

    return db.review.findMany({
      where: { productId },
      include: REVIEW_INCLUDE,
      orderBy,
    });
  }

  async getUserReview(userId: string, productId: string) {
    return db.review.findUnique({
      where: { userId_productId: { userId, productId } },
      include: REVIEW_INCLUDE,
    });
  }
}
