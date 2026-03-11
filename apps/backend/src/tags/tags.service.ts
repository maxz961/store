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
    const existing = await db.tag.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictException(`Tag slug "${data.slug}" already exists`);
    return db.tag.create({ data });
  }

  async update(id: string, data: { name?: string; slug?: string; color?: string }) {
    const tag = await db.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag ${id} not found`);
    return db.tag.update({ where: { id }, data });
  }

  async remove(id: string) {
    const tag = await db.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag ${id} not found`);
    return db.tag.delete({ where: { id } });
  }
}
