import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { db } from '@store/shared';


jest.mock('@store/shared', () => ({
  db: {
    errorLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));


const mockLog = {
  id: 'log-1',
  message: 'TypeError: Cannot read properties of undefined',
  stack: 'Error: ...\n  at Component',
  url: 'http://localhost:3000/admin/products',
  userId: 'user-1',
  isRead: false,
  createdAt: new Date('2026-01-01T10:00:00Z'),
};


describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsService],
    }).compile();

    service = module.get<LogsService>(LogsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an error log with userId', async () => {
      (db.errorLog.create as jest.Mock).mockResolvedValue(mockLog);

      const result = await service.create(
        { message: mockLog.message, stack: mockLog.stack, url: mockLog.url },
        'user-1',
      );

      expect(result).toEqual(mockLog);
      expect(db.errorLog.create).toHaveBeenCalledWith({
        data: {
          message: mockLog.message,
          stack: mockLog.stack,
          url: mockLog.url,
          userId: 'user-1',
        },
      });
    });

    it('should create an error log without userId (anonymous)', async () => {
      const anonymousLog = { ...mockLog, userId: null };
      (db.errorLog.create as jest.Mock).mockResolvedValue(anonymousLog);

      const result = await service.create({ message: mockLog.message });

      expect(result).toEqual(anonymousLog);
      expect(db.errorLog.create).toHaveBeenCalledWith({
        data: {
          message: mockLog.message,
          stack: undefined,
          url: undefined,
          userId: undefined,
        },
      });
    });

    it('should create a log with only required message field', async () => {
      const minimalLog = { ...mockLog, stack: null, url: null, userId: null };
      (db.errorLog.create as jest.Mock).mockResolvedValue(minimalLog);

      await service.create({ message: 'Error occurred' });

      expect(db.errorLog.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return all logs ordered by createdAt desc', async () => {
      (db.errorLog.findMany as jest.Mock).mockResolvedValue([mockLog]);

      const result = await service.findAll();

      expect(result).toEqual([mockLog]);
      expect(db.errorLog.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no logs', async () => {
      (db.errorLog.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread logs', async () => {
      (db.errorLog.count as jest.Mock).mockResolvedValue(5);

      const result = await service.getUnreadCount();

      expect(result).toBe(5);
      expect(db.errorLog.count).toHaveBeenCalledWith({ where: { isRead: false } });
    });

    it('should return 0 when all logs are read', async () => {
      (db.errorLog.count as jest.Mock).mockResolvedValue(0);

      const result = await service.getUnreadCount();

      expect(result).toBe(0);
    });
  });

  describe('markAllRead', () => {
    it('should mark all unread logs as read', async () => {
      (db.errorLog.updateMany as jest.Mock).mockResolvedValue({ count: 3 });

      const result = await service.markAllRead();

      expect(result).toEqual({ count: 3 });
      expect(db.errorLog.updateMany).toHaveBeenCalledWith({
        where: { isRead: false },
        data: { isRead: true },
      });
    });

    it('should return count 0 when no unread logs', async () => {
      (db.errorLog.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

      const result = await service.markAllRead();

      expect(result).toEqual({ count: 0 });
    });
  });
});
