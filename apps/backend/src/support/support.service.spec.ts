import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SupportService } from './support.service';
import { db } from '@store/shared';


jest.mock('@store/shared', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
    supportMessage: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));


const mockMessage = {
  id: 'msg-1',
  content: 'Помогите пожалуйста',
  fromAdmin: false,
  readAt: null,
  createdAt: new Date('2026-01-01T10:00:00Z'),
};

const mockUser = {
  id: 'user-1',
  name: 'Иван',
  email: 'ivan@example.com',
  image: null,
};


describe('SupportService', () => {
  let service: SupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportService],
    }).compile();

    service = module.get<SupportService>(SupportService);
    jest.clearAllMocks();
  });

  describe('getMyMessages', () => {
    it('should return messages for the user', async () => {
      (db.supportMessage.updateMany as jest.Mock).mockResolvedValue({ count: 0 });
      (db.supportMessage.findMany as jest.Mock).mockResolvedValue([mockMessage]);

      const result = await service.getMyMessages('user-1');

      expect(result).toEqual([mockMessage]);
      expect(db.supportMessage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
    });

    it('should mark admin messages as read before returning', async () => {
      (db.supportMessage.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (db.supportMessage.findMany as jest.Mock).mockResolvedValue([]);

      await service.getMyMessages('user-1');

      expect(db.supportMessage.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1', fromAdmin: true, readAt: null }),
        }),
      );
    });

    it('should return empty array when no messages', async () => {
      (db.supportMessage.updateMany as jest.Mock).mockResolvedValue({ count: 0 });
      (db.supportMessage.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getMyMessages('user-1');
      expect(result).toEqual([]);
    });
  });

  describe('sendMessage', () => {
    it('should create a message from the user', async () => {
      (db.supportMessage.create as jest.Mock).mockResolvedValue(mockMessage);

      const result = await service.sendMessage('user-1', { content: 'Помогите пожалуйста' });

      expect(result).toEqual(mockMessage);
      expect(db.supportMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { userId: 'user-1', content: 'Помогите пожалуйста', fromAdmin: false },
        }),
      );
    });
  });

  describe('adminGetThreads', () => {
    it('should return threads with last message and unread count', async () => {
      (db.supportMessage.findMany as jest.Mock).mockResolvedValue([
        { userId: 'user-1', createdAt: new Date(), user: mockUser },
      ]);
      (db.supportMessage.findFirst as jest.Mock).mockResolvedValue(mockMessage);
      (db.supportMessage.count as jest.Mock).mockResolvedValue(2);

      const result = await service.adminGetThreads();

      expect(result).toHaveLength(1);
      expect(result[0].user).toEqual(mockUser);
      expect(result[0].lastMessage).toEqual(mockMessage);
      expect(result[0].unreadCount).toBe(2);
    });

    it('should return empty array when no threads', async () => {
      (db.supportMessage.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.adminGetThreads();
      expect(result).toEqual([]);
    });
  });

  describe('adminGetMessages', () => {
    it('should return user and messages, and mark user messages as read', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (db.supportMessage.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (db.supportMessage.findMany as jest.Mock).mockResolvedValue([mockMessage]);

      const result = await service.adminGetMessages('user-1');

      expect(result.user).toEqual(mockUser);
      expect(result.messages).toEqual([mockMessage]);
      expect(db.supportMessage.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1', fromAdmin: false, readAt: null }),
        }),
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.adminGetMessages('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread admin messages for user', async () => {
      (db.supportMessage.count as jest.Mock).mockResolvedValue(3);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(3);
      expect(db.supportMessage.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', fromAdmin: true, readAt: null },
      });
    });

    it('should return 0 when no unread messages', async () => {
      (db.supportMessage.count as jest.Mock).mockResolvedValue(0);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(0);
    });
  });

  describe('adminGetTotalUnreadCount', () => {
    it('should return total count of unread user messages', async () => {
      (db.supportMessage.count as jest.Mock).mockResolvedValue(7);

      const result = await service.adminGetTotalUnreadCount();

      expect(result).toBe(7);
      expect(db.supportMessage.count).toHaveBeenCalledWith({
        where: { fromAdmin: false, readAt: null },
      });
    });

    it('should return 0 when no unread messages', async () => {
      (db.supportMessage.count as jest.Mock).mockResolvedValue(0);

      const result = await service.adminGetTotalUnreadCount();

      expect(result).toBe(0);
    });
  });

  describe('adminReply', () => {
    it('should create admin reply message', async () => {
      const adminMsg = { ...mockMessage, fromAdmin: true, content: 'Мы разбираемся' };
      (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (db.supportMessage.create as jest.Mock).mockResolvedValue(adminMsg);

      const result = await service.adminReply('user-1', { content: 'Мы разбираемся' });

      expect(result.fromAdmin).toBe(true);
      expect(result.content).toBe('Мы разбираемся');
      expect(db.supportMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { userId: 'user-1', content: 'Мы разбираемся', fromAdmin: true },
        }),
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.adminReply('nonexistent', { content: 'привет' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
