import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { UploadService } from './upload.service';

const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();
const mockRemove = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
        remove: mockRemove,
      }),
    },
  }),
}));

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const map: Record<string, string> = {
                SUPABASE_URL: 'https://test.supabase.co',
                SUPABASE_SERVICE_ROLE_KEY: 'test-key',
              };
              return map[key];
            },
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    jest.clearAllMocks();
  });

  const createMockFile = (
    overrides: Partial<Express.Multer.File> = {},
  ): Express.Multer.File =>
    ({
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test'),
      ...overrides,
    }) as Express.Multer.File;

  it('should upload a valid file and return public URL', async () => {
    mockUpload.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/bucket/file.jpg' },
    });

    const url = await service.uploadFile('bucket', createMockFile());

    expect(mockUpload).toHaveBeenCalled();
    expect(url).toContain('https://test.supabase.co');
  });

  it('should reject invalid MIME type', async () => {
    const file = createMockFile({ mimetype: 'application/pdf' });

    await expect(service.uploadFile('bucket', file)).rejects.toThrow(BadRequestException);
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('should reject file exceeding 5MB', async () => {
    const file = createMockFile({ size: 6 * 1024 * 1024 });

    await expect(service.uploadFile('bucket', file)).rejects.toThrow(BadRequestException);
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('should throw if Supabase upload fails', async () => {
    mockUpload.mockResolvedValue({ error: { message: 'Bucket not found' } });

    await expect(service.uploadFile('bucket', createMockFile())).rejects.toThrow(
      'Upload failed: Bucket not found',
    );
  });

  it('should accept image/png', async () => {
    mockUpload.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/file.png' } });

    const url = await service.uploadFile('bucket', createMockFile({ mimetype: 'image/png', originalname: 'photo.png' }));
    expect(url).toBeDefined();
  });

  it('should accept image/webp', async () => {
    mockUpload.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/file.webp' } });

    const url = await service.uploadFile('bucket', createMockFile({ mimetype: 'image/webp', originalname: 'photo.webp' }));
    expect(url).toBeDefined();
  });

  it('should delete a file', async () => {
    mockRemove.mockResolvedValue({ error: null });

    await service.deleteFile('bucket', 'path/to/file.jpg');
    expect(mockRemove).toHaveBeenCalledWith(['path/to/file.jpg']);
  });
});
