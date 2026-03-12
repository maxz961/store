import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '@store/shared';

const FAVORITES_LIMIT = 50;


@Injectable()
export class FavoritesService {
  async findAllForUser(userId: string) {
    return db.favorite.findMany({
      where: { userId },
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
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(userId: string, productId: string): Promise<{ ids: string[] }> {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const count = await db.favorite.count({ where: { userId } });
    if (count >= FAVORITES_LIMIT) {
      throw new BadRequestException(`Лимит избранного: не более ${FAVORITES_LIMIT} товаров`);
    }

    await db.favorite.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });

    const ids = await this.getProductIds(userId);
    return { ids };
  }

  async remove(userId: string, productId: string): Promise<{ ids: string[] }> {
    const favorite = await db.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!favorite) {
      throw new NotFoundException('Товар не найден в избранном');
    }

    await db.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });

    const ids = await this.getProductIds(userId);
    return { ids };
  }

  async getProductIds(userId: string): Promise<string[]> {
    const favorites = await db.favorite.findMany({
      where: { userId },
      select: { productId: true },
    });
    return favorites.map((f) => f.productId);
  }
}
