import { render, screen } from '@testing-library/react';


jest.mock('lucide-react', () => ({
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  Pencil: (props: any) => <div data-testid="icon-pencil" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron-right" {...props} />,
  ChevronLeft: (props: any) => <div data-testid="icon-chevron-left" {...props} />,
  ArrowUpDown: (props: any) => <div data-testid="icon-sort" {...props} />,
  ArrowUp: (props: any) => <div data-testid="icon-sort-asc" {...props} />,
  ArrowDown: (props: any) => <div data-testid="icon-sort-desc" {...props} />,
  Search: (props: any) => <div data-testid="icon-search" {...props} />,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

let mockApiGet: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
  },
}));

import AdminProductsPage from './page';


const mockProducts = {
  items: [
    {
      id: 'prod-1',
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


describe('AdminProductsPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockProducts);
  });

  it('renders add product button', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Добавить товар')).toBeInTheDocument();
  });

  it('renders product names', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Наушники Sony WH-1000XM5')).toBeInTheDocument();
    expect(screen.getByText('Черновик товара')).toBeInTheDocument();
  });

  it('renders category name', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Электроника')).toBeInTheDocument();
  });

  it('renders tags', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Беспроводные')).toBeInTheDocument();
  });

  it('renders published status in Russian', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Опубликован')).toBeInTheDocument();
    expect(screen.getByText('Черновик')).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Админ-панель')).toBeInTheDocument();
  });

  it('passes server: true for cookie forwarding', async () => {
    await AdminProductsPage({ searchParams: Promise.resolve({}) });
    expect(mockApiGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ server: true }),
    );
  });

  it('shows empty message when no products', async () => {
    mockApiGet = jest.fn().mockResolvedValue({ items: [], total: 0, page: 1, totalPages: 1 });
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Товары не найдены')).toBeInTheDocument();
  });

  it('highlights low stock', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    const zeroStock = screen.getByText('0');
    expect(zeroStock).toHaveClass('text-destructive');
  });

  it('renders sortable column headers', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Товар')).toBeInTheDocument();
    expect(screen.getByText('Цена')).toBeInTheDocument();
    expect(screen.getByText('Остаток')).toBeInTheDocument();
  });

  it('renders active sort icon when sortBy matches column', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({ sortBy: 'price', sortOrder: 'asc' }) });
    render(jsx);
    expect(screen.getByTestId('icon-sort-asc')).toBeInTheDocument();
  });

  it('passes sortBy and sortOrder to API', async () => {
    await AdminProductsPage({ searchParams: Promise.resolve({ sortBy: 'price', sortOrder: 'desc' }) });
    expect(mockApiGet).toHaveBeenCalledWith(
      expect.stringContaining('sortBy=price'),
      expect.any(Object),
    );
  });

  it('renders search input', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByPlaceholderText('Поиск товаров...')).toBeInTheDocument();
  });

  it('renders pagination with page numbers', async () => {
    mockApiGet = jest.fn().mockResolvedValue({ ...mockProducts, page: 1, totalPages: 3 });
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
