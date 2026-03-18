import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  Pencil: (props: any) => <div data-testid="icon-pencil" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron-right" {...props} />,
  ChevronLeft: (props: any) => <div data-testid="icon-chevron-left" {...props} />,
  ArrowUpDown: (props: any) => <div data-testid="icon-sort" {...props} />,
  ArrowUp: (props: any) => <div data-testid="icon-sort-asc" {...props} />,
  ArrowDown: (props: any) => <div data-testid="icon-sort-desc" {...props} />,
  Search: (props: any) => <div data-testid="icon-search" {...props} />,
  AlertTriangle: (props: any) => <div data-testid="icon-alert" {...props} />,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

let mockProductsData: any;
let mockIsLoading: boolean;
let mockImageErrorData: any;

jest.mock('@/lib/hooks/useAdmin', () => ({
  useAdminProducts: () => ({
    data: mockProductsData,
    isLoading: mockIsLoading,
  }),
  useImageErrorCount: () => ({
    data: mockImageErrorData,
  }),
  useAdminProductSuggestions: () => ({ data: undefined }),
}));

jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'nav.admin': 'Admin',
        'admin.dashboard.products': 'Products',
        'admin.products.addProduct': 'Add product',
        'admin.products.searchPlaceholder': 'Search products...',
        'admin.products.viewAll': 'All',
        'admin.products.viewBroken': 'Broken',
        'admin.products.colProduct': 'Product',
        'admin.products.colCategory': 'Category',
        'admin.products.colTags': 'Tags',
        'admin.products.colPrice': 'Price',
        'admin.products.colStock': 'Stock',
        'admin.products.colStatus': 'Status',
        'admin.products.notFound': 'Products not found',
        'admin.products.statusPublished': 'Published',
        'admin.products.statusDraft': 'Draft',
        'admin.products.prev': 'Previous',
        'admin.products.next': 'Next',
      };
      return map[key] ?? key;
    },
  }),
}));

import AdminProductsPage from './page';


const mockProducts = {
  items: [
    {
      id: 'prod-1',
      slug: 'sony-headphones',
      name: 'Sony WH-1000XM5 Headphones',
      price: 9999,
      stock: 25,
      isPublished: true,
      images: ['https://example.com/img.jpg'],
      category: { name: 'Electronics' },
      tags: [{ tag: { slug: 'wireless', name: 'Wireless' } }],
    },
    {
      id: 'prod-2',
      slug: 'draft-product',
      name: 'Draft Product',
      price: 500,
      stock: 0,
      isPublished: false,
      images: [],
      category: null,
      tags: [],
    },
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

const renderPage = () => render(<AdminProductsPage />, { wrapper: createWrapper() });


describe('AdminProductsPage', () => {
  beforeEach(() => {
    mockProductsData = mockProducts;
    mockIsLoading = false;
    mockImageErrorData = { count: 0 };
  });

  it('renders add product button', () => {
    renderPage();
    expect(screen.getByText('Add product')).toBeInTheDocument();
  });

  it('renders product names', () => {
    renderPage();
    expect(screen.getByText('Sony WH-1000XM5 Headphones')).toBeInTheDocument();
    expect(screen.getByText('Draft Product')).toBeInTheDocument();
  });

  it('renders category name', () => {
    renderPage();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderPage();
    expect(screen.getByText('Wireless')).toBeInTheDocument();
  });

  it('renders published status in English', () => {
    renderPage();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getAllByText('Products').length).toBeGreaterThanOrEqual(1);
  });

  it('shows empty message when no products', () => {
    mockProductsData = { items: [], total: 0, page: 1, totalPages: 1 };
    renderPage();
    expect(screen.getByText('Products not found')).toBeInTheDocument();
  });

  it('highlights low stock', () => {
    renderPage();
    const zeroStock = screen.getByText('0');
    expect(zeroStock).toHaveClass('text-destructive');
  });

  it('renders sortable column headers', () => {
    renderPage();
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('renders pagination with page numbers', () => {
    mockProductsData = { ...mockProducts, page: 1, totalPages: 3 };
    renderPage();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders view switch tabs', () => {
    renderPage();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Broken')).toBeInTheDocument();
  });

  it('shows loading spinner when fetching', () => {
    mockIsLoading = true;
    mockProductsData = undefined;
    renderPage();
    expect(screen.queryByText('Sony WH-1000XM5 Headphones')).not.toBeInTheDocument();
  });
});
