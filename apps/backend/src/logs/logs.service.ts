import { Injectable } from '@nestjs/common';
import { db } from '@store/shared';
import type { CreateLogDto } from './dto/create-log.dto';


@Injectable()
export class LogsService {
  async create(dto: CreateLogDto, userId?: string) {
    return db.errorLog.create({
      data: {
        message: dto.message,
        stack: dto.stack,
        url: dto.url,
        userId,
      },
    });
  }

  async findAll() {
    return db.errorLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount() {
    return db.errorLog.count({ where: { isRead: false } });
  }

  async markAllRead() {
    return db.errorLog.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  }
}
