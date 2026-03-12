import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { db } from "@store/shared";

@Injectable()
export class TagsService {
  async findAll() {
    return db.tag.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  }

  async findBySlug(slug: string) {
    const tag = await db.tag.findUnique({ where: { slug } });
    if (!tag) throw new NotFoundException(`Tag "${slug}" not found`);
    return tag;
  }

  async create(data: { name: string; slug: string; color?: string }) {
    const [existingSlug, existingName] = await Promise.all([
      db.tag.findFirst({ where: { slug: data.slug } }),
      db.tag.findFirst({ where: { name: data.name } }),
    ]);
    if (existingSlug) throw new ConflictException('Slug уже занят, выберите другой');
    if (existingName) throw new ConflictException('Название уже занято, введите другое');
    return db.tag.create({ data });
  }

  async update(id: string, data: { name?: string; slug?: string; color?: string }) {
    const tag = await db.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag ${id} not found`);

    if (data.slug) {
      const existingSlug = await db.tag.findFirst({ where: { slug: data.slug, NOT: { id } } });
      if (existingSlug) throw new ConflictException('Slug уже занят, выберите другой');
    }
    if (data.name) {
      const existingName = await db.tag.findFirst({ where: { name: data.name, NOT: { id } } });
      if (existingName) throw new ConflictException('Название уже занято, введите другое');
    }

    return db.tag.update({ where: { id }, data });
  }

  async remove(id: string) {
    const tag = await db.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag ${id} not found`);
    return db.tag.delete({ where: { id } });
  }
}
