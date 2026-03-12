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

import AdminProductsPage from './page';


const mockProducts = {
  items: [
    {
      id: 'prod-1',
      slug: 'sony-headphones',
      name: 'Наушники Sony WH-1000XM5',
      price: 9999,
      stock: 25,
      isPublished: true,
      images: ['https://example.com/img.jpg'],
      category: { name: 'Электроника' },
      tags: [{ tag: { slug: 'wireless', name: 'Беспроводные' } }],
    },
    {
      id: 'prod-2',
      slug: 'draft-product',
      name: 'Черновик товара',
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
    expect(screen.getByText('Добавить товар')).toBeInTheDocument();
  });

  it('renders product names', () => {
    renderPage();
    expect(screen.getByText('Наушники Sony WH-1000XM5')).toBeInTheDocument();
    expect(screen.getByText('Черновик товара')).toBeInTheDocument();
  });

  it('renders category name', () => {
    renderPage();
    expect(screen.getByText('Электроника')).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderPage();
    expect(screen.getByText('Беспроводные')).toBeInTheDocument();
  });

  it('renders published status in Russian', () => {
    renderPage();
    expect(screen.getByText('Опубликован')).toBeInTheDocument();
    expect(screen.getByText('Черновик')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Админ-панель')).toBeInTheDocument();
  });

  it('shows empty message when no products', () => {
    mockProductsData = { items: [], total: 0, page: 1, totalPages: 1 };
    renderPage();
    expect(screen.getByText('Товары не найдены')).toBeInTheDocument();
  });

  it('highlights low stock', () => {
    renderPage();
    const zeroStock = screen.getByText('0');
    expect(zeroStock).toHaveClass('text-destructive');
  });

  it('renders sortable column headers', () => {
    renderPage();
    expect(screen.getByText('Товар')).toBeInTheDocument();
    expect(screen.getByText('Цена')).toBeInTheDocument();
    expect(screen.getByText('Остаток')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Поиск товаров...')).toBeInTheDocument();
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
    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Проблемные')).toBeInTheDocument();
  });

  it('shows loading spinner when fetching', () => {
    mockIsLoading = true;
    mockProductsData = undefined;
    renderPage();
    expect(screen.queryByText('Наушники Sony WH-1000XM5')).not.toBeInTheDocument();
  });
});
