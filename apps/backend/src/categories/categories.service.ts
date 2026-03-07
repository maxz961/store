import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { db } from "@store/shared";

export class CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

@Injectable()
export class CategoriesService {
  async findAll() {
    return db.category.findMany({
      include: { children: true, _count: { select: { products: true } } },
      where: { parentId: null },
      orderBy: { name: "asc" },
    });
  }

  async findBySlug(slug: string) {
    const category = await db.category.findUnique({
      where: { slug },
      include: { children: true, products: { where: { isPublished: true }, take: 20 } },
    });
    if (!category) throw new NotFoundException(`Category "${slug}" not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await db.category.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Category slug "${dto.slug}" already exists`);
    return db.category.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateCategoryDto>) {
    await this.findById(id);
    return db.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return db.category.delete({ where: { id } });
  }

  private async findById(id: string) {
    const cat = await db.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);
    return cat;
  }
}
