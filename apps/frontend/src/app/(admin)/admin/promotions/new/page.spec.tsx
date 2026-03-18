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

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
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
let mockApiPost: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    post: (...args: any[]) => mockApiPost(...args),
  },
}));

import NewPromotionPage from './page';


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

const renderPage = () => render(<NewPromotionPage />, { wrapper: createWrapper() });

const mockProducts = {
  items: [
    {
      id: 'p1',
      name: 'Product 1',
      slug: 'product-1',
      price: 100,
      images: [],
      stock: 10,
      category: { name: 'Electronics', slug: 'electronics' },
      tags: [],
      reviews: [],
    },
  ],
  total: 1,
  page: 1,
  totalPages: 1,
};


describe('NewPromotionPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path.startsWith('/products')) return Promise.resolve(mockProducts);
      return Promise.resolve([]);
    });
    mockApiPost = jest.fn().mockResolvedValue({ id: 'new-promo' });
  });

  it('renders all form sections', () => {
    renderPage();
    expect(screen.getByText('Basic information')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText('Banner')).toBeInTheDocument();
    expect(screen.getByText('Products in promotion')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Promotions')).toBeInTheDocument();
    expect(screen.getByText('New promotion')).toBeInTheDocument();
  });

  it('auto-generates slug from title', () => {
    renderPage();
    const titleInput = screen.getByPlaceholderText('e.g. Spring Sale');
    fireEvent.change(titleInput, { target: { value: 'Spring Sale' } });
    const slugInput = screen.getByDisplayValue('spring-sale');
    expect(slugInput).toBeInTheDocument();
  });

  it('toggles product selection', async () => {
    renderPage();
    const productBtn = await screen.findByText('Product 1');
    fireEvent.click(productBtn);
    expect(productBtn).toHaveClass('bg-primary');
    fireEvent.click(productBtn);
    expect(productBtn).not.toHaveClass('bg-primary');
  });

  it('renders submit button "Create promotion"', () => {
    renderPage();
    expect(screen.getByText('Create promotion')).toBeInTheDocument();
  });

  it('submits form and redirects', async () => {
    const { container } = renderPage();

    // Fill UK title
    fireEvent.change(screen.getByPlaceholderText('e.g. Spring Sale'), { target: { value: 'Spring Sale' } });

    // Switch to EN tab and fill required titleEn
    fireEvent.click(screen.getByText(/🇬🇧/));
    fireEvent.change(screen.getByPlaceholderText('e.g. Spring Sale'), { target: { value: 'Spring Sale EN' } });

    // Switch banner section to URL mode so the URL input is visible
    fireEvent.click(screen.getByText('By URL'));
    fireEvent.change(screen.getByPlaceholderText('https://images.unsplash.com/...'), { target: { value: 'https://img.jpg' } });

    const startDateInput = container.querySelector('input[name="startDate"]')!;
    const endDateInput = container.querySelector('input[name="endDate"]')!;
    fireEvent.change(startDateInput, { target: { value: '2026-04-01T00:00' } });
    fireEvent.change(endDateInput, { target: { value: '2026-04-30T23:59' } });

    fireEvent.change(screen.getByPlaceholderText('25'), { target: { value: '15' } });

    fireEvent.submit(screen.getByText('Create promotion').closest('form')!);

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/promotions', expect.objectContaining({
        title: 'Spring Sale',
        slug: 'spring-sale',
        bannerImageUrl: 'https://img.jpg',
        discountType: 'PERCENTAGE',
        discountValue: 15,
      }));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/promotions');
    });
  });

  it('shows error on submit failure', async () => {
    mockApiPost = jest.fn().mockRejectedValue(new Error('Failed to create promotion'));
    const { container } = renderPage();

    // Fill UK title
    fireEvent.change(screen.getByPlaceholderText('e.g. Spring Sale'), { target: { value: 'Test' } });

    // Switch to EN tab and fill required titleEn
    fireEvent.click(screen.getByText(/🇬🇧/));
    fireEvent.change(screen.getByPlaceholderText('e.g. Spring Sale'), { target: { value: 'Test EN' } });

    // Switch banner section to URL mode so the URL input is visible
    fireEvent.click(screen.getByText('By URL'));
    fireEvent.change(screen.getByPlaceholderText('https://images.unsplash.com/...'), { target: { value: 'https://img.jpg' } });

    const startDateInput = container.querySelector('input[name="startDate"]')!;
    const endDateInput = container.querySelector('input[name="endDate"]')!;
    fireEvent.change(startDateInput, { target: { value: '2026-04-01T00:00' } });
    fireEvent.change(endDateInput, { target: { value: '2026-04-30T23:59' } });

    fireEvent.change(screen.getByPlaceholderText('25'), { target: { value: '15' } });

    fireEvent.submit(screen.getByText('Create promotion').closest('form')!);

    expect(await screen.findByText('Failed to create promotion')).toBeInTheDocument();
  });
});
