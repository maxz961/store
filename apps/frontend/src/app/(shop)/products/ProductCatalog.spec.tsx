import { render, screen } from '@testing-library/react';
import { ProductCatalog } from './ProductCatalog';


const mockGet = jest.fn().mockReturnValue(undefined);

jest.mock('@/lib/hooks/useProductParams', () => ({
  useProductParams: () => ({ get: mockGet, update: jest.fn(), reset: jest.fn() }),
}));

const mockUseProducts = jest.fn();
const mockUseCategories = jest.fn().mockReturnValue({ data: [] });
const mockUseTags = jest.fn().mockReturnValue({ data: [] });

jest.mock('@/lib/hooks/useProducts', () => ({
  useProducts: (...args: unknown[]) => mockUseProducts(...args),
  useCategories: () => mockUseCategories(),
  useTags: () => mockUseTags(),
}));

// Mock ProductCard to avoid Next.js Image issues in tests
jest.mock('@/components/product/ProductCard', () => ({
  ProductCard: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}));

// Mock ProductFilters
jest.mock('./ProductFilters', () => ({
  ProductFilters: () => <div data-testid="product-filters" />,


}));

const mockProduct = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  price: 99.99,
  images: [],
  stock: 10,
  category: { name: 'Electronics', slug: 'electronics' },
  tags: [],
};

describe('ProductCatalog', () => {
  beforeEach(() => {
    mockGet.mockReturnValue(undefined);
  });

  it('shows spinner while loading', () => {
    mockUseProducts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
    });

    const { container } = render(<ProductCatalog />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows spinner while fetching (refetch after filter change)', () => {
    mockUseProducts.mockReturnValue({
      data: { items: [mockProduct], total: 1, page: 1, totalPages: 1 },
      isLoading: false,
      isFetching: true,
      isError: false,
    });

    const { container } = render(<ProductCatalog />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('hides spinner when data is loaded', () => {
    mockUseProducts.mockReturnValue({
      data: { items: [mockProduct], total: 1, page: 1, totalPages: 1 },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    const { container } = render(<ProductCatalog />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseProducts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
    });

    render(<ProductCatalog />);
    expect(screen.getByText('Ошибка загрузки')).toBeInTheDocument();
    expect(screen.getByText('Не удалось загрузить товары')).toBeInTheDocument();
  });

  it('shows empty state when no products', () => {
    mockUseProducts.mockReturnValue({
      data: { items: [], total: 0, page: 1, totalPages: 0 },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    render(<ProductCatalog />);
    expect(screen.getByText('Товары не найдены')).toBeInTheDocument();
  });

  it('renders product cards', () => {
    mockUseProducts.mockReturnValue({
      data: {
        items: [
          mockProduct,
          { ...mockProduct, id: '2', name: 'Another Product', slug: 'another' },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    render(<ProductCatalog />);
    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Another Product')).toBeInTheDocument();
  });

  it('renders filters sidebar', () => {
    mockUseProducts.mockReturnValue({
      data: { items: [], total: 0, page: 1, totalPages: 0 },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    render(<ProductCatalog />);
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('passes URL params to useProducts', () => {
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        search: 'laptop',
        categorySlug: 'electronics',
      };
      return params[key];
    });

    mockUseProducts.mockReturnValue({
      data: { items: [], total: 0, page: 1, totalPages: 0 },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    render(<ProductCatalog />);

    expect(mockUseProducts).toHaveBeenCalledWith({
      search: 'laptop',
      categorySlug: 'electronics',
      tagSlugs: undefined,
      page: undefined,
    });
  });
});
