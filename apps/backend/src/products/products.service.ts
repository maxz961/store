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
    const { search, categorySlug, tagSlugs, minPrice, maxPrice, page = 1, limit = 20 } = filters;

    const where: Record<string, unknown> = {
      ...(adminMode ? {} : { isPublished: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(tagSlugs?.length && {
        tags: { some: { tag: { slug: { in: tagSlugs } } } },
      }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    };

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true, tags: { include: { tag: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
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
    const existing = await db.product.findUnique({ where: { slug: dto.slug } });
    if (existing) {
      throw new ConflictException(`Product with slug "${dto.slug}" already exists`);
    }

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

  async remove(id: string) {
    await this.findById(id);
    return db.product.delete({ where: { id } });
  }
}
