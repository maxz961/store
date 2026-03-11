import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { db, OrderStatus, Prisma } from "@store/shared";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@Injectable()
export class OrdersService {
  async create(userId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, isPublished: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException("One or more products not found or unavailable");
    }

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}"`,
        );
      }
    }

    const totalAmount = dto.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + Number(product.price) * item.quantity;
    }, 0);

    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          totalAmount,
          deliveryMethod: dto.deliveryMethod,
          shippingAddress: dto.shippingAddress as unknown as Prisma.InputJsonValue,
          orderItems: {
            create: dto.items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: { orderItems: { include: { product: true } } },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return order;
  }

  async findAllForUser(userId: string) {
    return db.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll(
    rawPage?: number | string,
    rawLimit?: number | string,
    status?: OrderStatus,
    sortBy: 'createdAt' | 'totalAmount' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const page = Math.max(1, Number(rawPage) || 1);
    const limit = Math.max(1, Math.min(100, Number(rawLimit) || 20));
    const where = status ? { status } : {};
    const orderBy = sortBy === 'totalAmount'
      ? { totalAmount: sortOrder }
      : { createdAt: sortOrder };

    const [items, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          orderItems: { include: { product: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      db.order.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: { include: { product: true } },
      },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.findById(id);
    return db.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
