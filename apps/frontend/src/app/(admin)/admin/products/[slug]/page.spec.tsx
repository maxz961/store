import { act, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'admin.product.basicInfo': 'Basic information',
        'admin.product.pricingAndStock': 'Pricing & Stock',
        'admin.product.images': 'Images',
        'admin.product.name': 'Name (UK)',
        'admin.product.nameEn': 'Name (EN)',
        'admin.product.description': 'Description (UK)',
        'admin.product.descriptionEn': 'Description (EN)',
        'admin.product.slug': 'Slug',
        'admin.product.slugHint': 'Used in URL',
        'admin.product.priceLabel': 'Price (₴)',
        'admin.product.oldPriceLabel': 'Compare price',
        'admin.product.stockLabel': 'Stock',
        'admin.product.optional': 'Optional',
        'admin.product.category': 'Category',
        'admin.product.selectCategory': 'Select category',
        'admin.product.tags': 'Tags',
        'admin.product.uploadFile': 'Upload file',
        'admin.product.byUrl': 'By URL',
        'admin.product.imageUrlsLabel': 'Image URLs',
        'admin.product.imageUrlsHint': 'Multiple URLs separated by commas',
        'admin.product.currentImages': 'Current images',
        'admin.product.preview': 'Preview',
        'admin.product.publishedLabel': 'Published',
        'admin.product.publishNow': 'Publish immediately',
        'admin.product.save': 'Save changes',
        'admin.product.saving': 'Saving...',
        'admin.product.cancel': 'Cancel',
        'admin.product.edit': 'Edit product',
        'admin.product.categoryAndTags': 'Category & Tags',
        'admin.dashboard.products': 'Products',
        'common.langUk': 'UK',
        'common.langEn': 'EN',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  ChevronDown: (props: any) => <div data-testid="icon-chevron-down" {...props} />,
  ImagePlus: (props: any) => <div data-testid="icon-image-plus" {...props} />,
  X: (props: any) => <div data-testid="icon-x" {...props} />,
  Eye: (props: any) => <div data-testid="icon-eye" {...props} />,
  ImageIcon: (props: any) => <div data-testid="icon-image" {...props} />,
  ImageOff: (props: any) => <div data-testid="icon-image-off" {...props} />,
  ShoppingCart: (props: any) => <div data-testid="icon-cart" {...props} />,
  Minus: (props: any) => <div data-testid="icon-minus" {...props} />,
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  Check: (props: any) => <div data-testid="icon-check" {...props} />,
  Star: (props: any) => <div data-testid="icon-star" {...props} />,
  Heart: (props: any) => <div data-testid="icon-heart" {...props} />,
  HelpCircle: (props: any) => <div data-testid="icon-help" {...props} />,
  Info: (props: any) => <div data-testid="icon-info" {...props} />,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: any) => <img {...props} />,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: false }),
}));

jest.mock('@/lib/hooks/useFavorites', () => ({
  useFavoriteIds: () => ({ data: [] }),
  useAddFavorite: () => ({ mutate: jest.fn() }),
  useRemoveFavorite: () => ({ mutate: jest.fn() }),
}));

let mockApiGet: jest.Mock;
let mockApiPost: jest.Mock;
let mockApiPut: jest.Mock;
let mockApiUploadFiles: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    post: (...args: any[]) => mockApiPost(...args),
    put: (...args: any[]) => mockApiPut(...args),
    uploadFiles: (...args: any[]) => mockApiUploadFiles(...args),
  },
}));

import EditProductPage from './page';


const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

const mockProduct = {
  id: 'p1',
  name: 'Existing Product',
  nameEn: 'Existing Product EN',
  slug: 'existing-product',
  description: 'Some description here',
  descriptionEn: 'Some description here EN',
  price: 299,
  comparePrice: null,
  stock: 10,
  sku: 'SKU-1',
  isPublished: true,
  categoryId: 'cat-1',
  images: ['https://example.com/img.jpg'],
  tags: [{ tag: { id: 'tag-1', name: 'New', nameEn: 'New', slug: 'new' } }],
};


describe('EditProductPage', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/1');
    global.URL.revokeObjectURL = jest.fn();
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path === '/products/existing-product') return Promise.resolve(mockProduct);
      if (path === '/categories') return Promise.resolve([{ id: 'cat-1', name: 'Electronics', slug: 'electronics' }]);
      if (path === '/tags') return Promise.resolve([{ id: 'tag-1', name: 'New', slug: 'new' }]);
      return Promise.resolve([]);
    });
    mockApiPost = jest.fn().mockResolvedValue({});
    mockApiPut = jest.fn().mockResolvedValue({ id: 'p1' });
    mockApiUploadFiles = jest.fn().mockResolvedValue({ urls: [] });
  });

  it('renders form sections', async () => {
    await act(async () => {
      render(<EditProductPage params={Promise.resolve({ slug: 'existing-product' })} />, {
        wrapper: createWrapper(),
      });
    });
    expect(await screen.findByText('Basic information')).toBeInTheDocument();
    expect(screen.getByText('Pricing & Stock')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
  });
});
