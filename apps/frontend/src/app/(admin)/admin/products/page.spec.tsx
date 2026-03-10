import { render, screen } from '@testing-library/react';


jest.mock('lucide-react', () => ({
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  Pencil: (props: any) => <div data-testid="icon-pencil" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
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

  it('renders title', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByRole('heading', { name: 'Товары' })).toBeInTheDocument();
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

  it('renders pagination info', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText(/Всего 2 товаров/)).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    const jsx = await AdminProductsPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Админ-панель')).toBeInTheDocument();
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
});
