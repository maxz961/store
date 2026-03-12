import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '@store/shared';
import { SendMessageDto } from './dto/send-message.dto';


const MESSAGE_SELECT = {
  id: true,
  content: true,
  fromAdmin: true,
  readAt: true,
  createdAt: true,
};

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
};

@Injectable()
export class SupportService {
  async getMyMessages(userId: string) {
    await this.markAdminMessagesAsRead(userId);

    return db.supportMessage.findMany({
      where: { userId },
      select: MESSAGE_SELECT,
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(userId: string, dto: SendMessageDto) {
    return db.supportMessage.create({
      data: { userId, content: dto.content, fromAdmin: false },
      select: MESSAGE_SELECT,
    });
  }

  async getUnreadCount(userId: string) {
    return db.supportMessage.count({
      where: { userId, fromAdmin: true, readAt: null },
    });
  }

  async adminGetTotalUnreadCount() {
    return db.supportMessage.count({
      where: { fromAdmin: false, readAt: null },
    });
  }

  async adminGetThreads() {
    const threads = await db.supportMessage.findMany({
      distinct: ['userId'],
      orderBy: { createdAt: 'desc' },
      select: {
        userId: true,
        createdAt: true,
        user: { select: USER_SELECT },
      },
    });

    const result = await Promise.all(
      threads.map(async (t) => {
        const lastMessage = await db.supportMessage.findFirst({
          where: { userId: t.userId },
          orderBy: { createdAt: 'desc' },
          select: { ...MESSAGE_SELECT },
        });

        const unreadCount = await db.supportMessage.count({
          where: { userId: t.userId, fromAdmin: false, readAt: null },
        });

        return { user: t.user, lastMessage, unreadCount };
      }),
    );

    return result;
  }

  async adminGetMessages(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: USER_SELECT,
    });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    await db.supportMessage.updateMany({
      where: { userId, fromAdmin: false, readAt: null },
      data: { readAt: new Date() },
    });

    const messages = await db.supportMessage.findMany({
      where: { userId },
      select: MESSAGE_SELECT,
      orderBy: { createdAt: 'asc' },
    });

    return { user, messages };
  }

  async adminReply(userId: string, dto: SendMessageDto) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    return db.supportMessage.create({
      data: { userId, content: dto.content, fromAdmin: true },
      select: MESSAGE_SELECT,
    });
  }

  private async markAdminMessagesAsRead(userId: string) {
    await db.supportMessage.updateMany({
      where: { userId, fromAdmin: true, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
