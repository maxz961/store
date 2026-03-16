import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { db } from "@store/shared";
import { CreatePromotionDto } from "./dto/create-promotion.dto";
import { UpdatePromotionDto } from "./dto/update-promotion.dto";

const PROMOTION_INCLUDE = {
  products: {
    include: {
      product: {
        select: { id: true, name: true, slug: true, images: true, price: true },
      },
    },
  },
};

const PRODUCT_CARD_INCLUDE = {
  products: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          comparePrice: true,
          images: true,
          stock: true,
          isPublished: true,
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
          reviews: { select: { rating: true } },
        },
      },
    },
  },
};

@Injectable()
export class PromotionsService {
  async findAll() {
    return db.promotion.findMany({
      include: PROMOTION_INCLUDE,
      orderBy: { position: "asc" },
    });
  }

  async findActive() {
    const now = new Date();

    return db.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { position: "asc" },
    });
  }

  async findById(id: string) {
    const promotion = await db.promotion.findUnique({
      where: { id },
      include: PROMOTION_INCLUDE,
    });

    if (!promotion) throw new NotFoundException(`Promotion ${id} not found`);
    return promotion;
  }

  async create(dto: CreatePromotionDto) {
    const existing = await db.promotion.findUnique({ where: { slug: dto.slug } });
    if (existing) {
      throw new ConflictException(`Promotion with slug "${dto.slug}" already exists`);
    }

    const { productIds = [], ...data } = dto;

    return db.promotion.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        products: {
          create: productIds.map((productId) => ({ productId })),
        },
      },
      include: PROMOTION_INCLUDE,
    });
  }

  async update(id: string, dto: UpdatePromotionDto) {
    await this.findById(id);

    const { productIds, startDate, endDate, ...data } = dto;

    return db.promotion.update({
      where: { id },
      data: {
        ...data,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(productIds !== undefined && {
          products: {
            deleteMany: {},
            create: productIds.map((productId) => ({ productId })),
          },
        }),
      },
      include: PROMOTION_INCLUDE,
    });
  }

  async findBySlug(slug: string) {
    const now = new Date();

    const promotion = await db.promotion.findFirst({
      where: {
        slug,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: PRODUCT_CARD_INCLUDE,
    });

    if (!promotion) throw new NotFoundException(`Promotion with slug "${slug}" not found`);
    return promotion;
  }

  async remove(id: string) {
    await this.findById(id);
    return db.promotion.delete({ where: { id } });
  }
}
