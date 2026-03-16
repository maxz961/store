import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { db } from "@store/shared";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductFiltersDto } from "./dto/product-filters.dto";

@Injectable()
export class ProductsService {
  async findAll(filters: ProductFiltersDto, adminMode = false) {
    const { search, categorySlug, tagSlugs, minPrice, maxPrice, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', imageError, nameOnly } = filters;

    const where: Record<string, unknown> = {
      ...(adminMode ? {} : { isPublished: true }),
      ...(search && (nameOnly
        ? { name: { contains: search, mode: "insensitive" } }
        : { OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
      )),
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(tagSlugs?.length && {
        tags: { some: { tag: { slug: { in: tagSlugs } } } },
      }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
      ...(imageError !== undefined && { hasImageError: imageError }),
    };

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          tags: { include: { tag: true } },
          reviews: { select: { rating: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      db.product.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: { include: { tag: true } },
        reviews: { include: { user: { select: { id: true, name: true, image: true } } } },
      },
    });

    if (!product) throw new NotFoundException(`Product "${slug}" not found`);
    return product;
  }

  async findById(id: string) {
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true, tags: { include: { tag: true } } },
    });

    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    const [existingSlug, existingName] = await Promise.all([
      db.product.findFirst({ where: { slug: dto.slug } }),
      db.product.findFirst({ where: { name: dto.name } }),
    ]);
    if (existingSlug) throw new ConflictException('Slug уже занят, выберите другой');
    if (existingName) throw new ConflictException('Название уже занято, введите другое');

    const { tagIds = [], ...data } = dto;

    return db.product.create({
      data: {
        ...data,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: { category: true, tags: { include: { tag: true } } },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);

    if (dto.slug) {
      const existingSlug = await db.product.findFirst({ where: { slug: dto.slug, NOT: { id } } });
      if (existingSlug) throw new ConflictException('Slug уже занят, выберите другой');
    }
    if (dto.name) {
      const existingName = await db.product.findFirst({ where: { name: dto.name, NOT: { id } } });
      if (existingName) throw new ConflictException('Название уже занято, введите другое');
    }

    const { tagIds, ...data } = dto;

    return db.product.update({
      where: { id },
      data: {
        ...data,
        ...(tagIds !== undefined && {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          },
        }),
      },
      include: { category: true, tags: { include: { tag: true } } },
    });
  }

  async findSimilar(slug: string, limit = 8) {
    const product = await db.product.findUnique({
      where: { slug },
      select: { id: true, categoryId: true },
    });

    if (!product) throw new NotFoundException(`Product "${slug}" not found`);

    return db.product.findMany({
      where: {
        isPublished: true,
        ...(product.categoryId && { categoryId: product.categoryId }),
        id: { not: product.id },
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
        reviews: { select: { rating: true } },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return db.product.delete({ where: { id } });
  }

  async reportImageError(id: string) {
    const product = await db.product.findUnique({ where: { id }, select: { id: true } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);

    return db.product.update({ where: { id }, data: { hasImageError: true } });
  }

  async getImageErrorCount() {
    const count = await db.product.count({ where: { hasImageError: true } });
    return { count };
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    const result = await db.product.aggregate({
      where: { isPublished: true },
      _min: { price: true },
      _max: { price: true },
    });
    return {
      min: Number(result._min.price ?? 0),
      max: Number(result._max.price ?? 0),
    };
  }
}
