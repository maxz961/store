import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'admin.promotion.basicInfoTitle': 'Basic information',
        'admin.promotion.bannerTitle': 'Banner',
        'admin.promotion.bannerPreview': 'Preview',
        'admin.promotion.bannerUploadFile': 'Upload file',
        'admin.promotion.bannerByUrl': 'By URL',
        'admin.promotion.bannerCurrent': 'Current image',
        'admin.promotion.bannerUploading': 'Uploading image...',
        'admin.promotion.bannerUploadFailed': 'Failed to upload image',
        'admin.promotion.bannerImageUrl': 'Image URL',
        'admin.promotion.bannerBgColor': 'Background color',
        'admin.promotion.bannerCurrentColor': 'Current:',
        'admin.promotion.bannerLink': 'Link',
        'admin.promotion.discountTitle': 'Discount',
        'admin.promotion.discountType': 'Discount type',
        'admin.promotion.discountValue': 'Discount amount',
        'admin.promotion.discountPosition': 'Position in carousel',
        'admin.promotion.scheduleTitle': 'Schedule',
        'admin.promotion.scheduleStartDate': 'Start date',
        'admin.promotion.scheduleEndDate': 'End date',
        'admin.promotion.scheduleActive': 'Active',
        'admin.promotion.scheduleActiveHint': 'If disabled, the promotion will not be displayed in the catalog even during the active period',
        'admin.promotion.productsTitle': 'Products in promotion',
        'admin.promotion.title': 'Title (UK)',
        'admin.promotion.titleEn': 'Title (EN)',
        'admin.promotion.description': 'Description (UK)',
        'admin.promotion.descriptionEn': 'Description (EN)',
        'admin.promotion.titlePlaceholder': 'e.g. Spring Sale',
        'admin.promotion.descriptionPlaceholder': 'Short promotion description...',
        'admin.promotion.slug': 'Slug',
        'admin.promotion.slugHint': 'Generated automatically from title',
        'admin.promotion.save': 'Save',
        'admin.promotion.saving': 'Saving...',
        'admin.promotion.saveChanges': 'Save changes',
        'admin.promotion.create': 'Create promotion',
        'admin.promotion.creating': 'Creating...',
        'admin.promotion.delete': 'Delete promotion',
        'admin.promotion.deleting': 'Deleting...',
        'admin.promotion.cancel': 'Cancel',
        'admin.promotion.new': 'New promotion',
        'admin.promotion.breadcrumbLabel': 'Promotions',
        'admin.promotion.loadFailed': 'Failed to load promotion',
        'admin.promotion.createFailed': 'Failed to create promotion',
        'admin.promotion.updateFailed': 'Failed to update promotion',
        'admin.promotion.dangerZone': 'Danger zone',
        'admin.promotion.dangerText': 'Deleting a promotion is irreversible. The banner will disappear from the catalog and product links will be removed.',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  ChevronDown: (props: any) => <div data-testid="icon-chevron-down" {...props} />,
  Eye: (props: any) => <div data-testid="icon-eye" {...props} />,
  X: (props: any) => <div data-testid="icon-x" {...props} />,
  ImagePlus: (props: any) => <div data-testid="icon-image-plus" {...props} />,
  Info: (props: any) => <div data-testid="icon-info" {...props} />,
  HelpCircle: (props: any) => <div data-testid="icon-help" {...props} />,
}));

jest.mock('next/image', () => {
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  const MockImage = (props: any) => <img {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

jest.mock('@/components/ui/Spinner', () => {
  const MockSpinner = () => <div data-testid="spinner">Loading...</div>;
  MockSpinner.displayName = 'MockSpinner';
  return { Spinner: MockSpinner };
});

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'promo-1' }),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/hooks/useAdmin', () => ({
  useUploadProductImages: () => ({
    mutateAsync: jest.fn().mockResolvedValue({ urls: ['https://example.com/uploaded.jpg'] }),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

let mockApiGet: jest.Mock;
let mockApiPut: jest.Mock;
let mockApiDelete: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    put: (...args: any[]) => mockApiPut(...args),
    delete: (...args: any[]) => mockApiDelete(...args),
  },
}));

import EditPromotionPage from './page';


const mockPromotion = {
  id: 'promo-1',
  title: 'Весенняя распродажа',
  slug: 'spring-sale',
  description: 'Скидки на все',
  bannerImageUrl: 'https://example.com/banner.jpg',
  bannerBgColor: '#e8f5e9',
  startDate: '2026-03-01T00:00:00.000Z',
  endDate: '2026-04-01T00:00:00.000Z',
  discountType: 'PERCENTAGE',
  discountValue: 25,
  isActive: true,
  position: 0,
  link: '/products?tagSlugs=sale',
  createdAt: '2026-02-01T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
  products: [
    {
      productId: 'p1',
      product: { id: 'p1', name: 'Товар 1', slug: 't1', images: [], price: 100 },
    },
  ],
};

const mockProducts = {
  items: [
    { id: 'p1', name: 'Товар 1', slug: 't1', images: [], price: 100, stock: 10, category: { name: 'Cat', slug: 'cat' }, tags: [], reviews: [] },
    { id: 'p2', name: 'Товар 2', slug: 't2', images: [], price: 200, stock: 5, category: { name: 'Cat', slug: 'cat' }, tags: [], reviews: [] },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
};

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

const renderPage = () =>
  render(<EditPromotionPage />, { wrapper: createWrapper() });


describe('EditPromotionPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path === '/promotions/promo-1') return Promise.resolve(mockPromotion);
      if (path.startsWith('/products')) return Promise.resolve(mockProducts);
      return Promise.resolve(null);
    });
    mockApiPut = jest.fn().mockResolvedValue(mockPromotion);
    mockApiDelete = jest.fn().mockResolvedValue(undefined);
  });

  it('renders loading spinner initially', () => {
    mockApiGet = jest.fn().mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders save button after data loads', async () => {
    renderPage();
    expect(await screen.findByText('Save changes')).toBeInTheDocument();
  });

  it('renders all form sections', async () => {
    renderPage();
    expect(await screen.findByText('Basic information')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText('Banner')).toBeInTheDocument();
    expect(screen.getByText('Products in promotion')).toBeInTheDocument();
  });

  it('renders breadcrumbs with promotion title', async () => {
    renderPage();
    expect(await screen.findByText('Promotions')).toBeInTheDocument();
    expect(screen.getByText('Весенняя распродажа')).toBeInTheDocument();
  });

  it('prefills form fields with promotion data', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Весенняя распродажа')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('spring-sale')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Скидки на все')).toBeInTheDocument();
    // bannerImageUrl is in file-mode thumbnail, not a visible input by default
    expect(screen.getByDisplayValue('/products?tagSlugs=sale')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  it('renders delete button', async () => {
    renderPage();
    expect(await screen.findByText('Delete promotion')).toBeInTheDocument();
  });

  it('renders submit button', async () => {
    renderPage();
    expect(await screen.findByText('Save changes')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path === '/promotions/promo-1') return Promise.reject(new Error('Not found'));
      if (path.startsWith('/products')) return Promise.resolve(mockProducts);
      return Promise.resolve(null);
    });
    renderPage();
    expect(await screen.findByText('Failed to load promotion')).toBeInTheDocument();
  });

  it('renders danger zone section', async () => {
    renderPage();
    expect(await screen.findByText('Danger zone')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Deleting a promotion is irreversible. The banner will disappear from the catalog and product links will be removed.',
      ),
    ).toBeInTheDocument();
  });

  it('loads products for toggle selection', async () => {
    renderPage();
    await screen.findByText('Products in promotion');
    expect(await screen.findByText('Товар 1')).toBeInTheDocument();
    expect(screen.getByText('Товар 2')).toBeInTheDocument();
  });

  it('calls delete mutation and redirects on success', async () => {
    renderPage();
    const deleteBtn = await screen.findByText('Delete promotion');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledWith('/promotions/promo-1');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/promotions');
    });
  });
});
