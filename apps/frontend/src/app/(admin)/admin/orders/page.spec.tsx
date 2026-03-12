import { render, screen } from '@testing-library/react';


jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  ChevronLeft: (props: any) => <div data-testid="icon-chevron-left" {...props} />,
  ChevronDown: (props: any) => <div data-testid="icon-chevron-down" {...props} />,
  ChevronUp: (props: any) => <div data-testid="icon-chevron-up" {...props} />,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

let mockApiGet: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
  },
}));

import AdminOrdersPage from './page';


const mockOrders = {
  items: [
    {
      id: 'order-aaa11111',
      status: 'PENDING',
      deliveryMethod: 'COURIER',
      totalAmount: 2500,
      createdAt: '2026-03-01T10:00:00Z',
      user: { name: 'Иван Петров', email: 'ivan@test.com' },
    },
    {
      id: 'order-bbb22222',
      status: 'DELIVERED',
      deliveryMethod: 'PICKUP',
      totalAmount: 750,
      createdAt: '2026-02-20T15:00:00Z',
      user: { name: null, email: 'anon@test.com' },
    },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
};


describe('AdminOrdersPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockOrders);
  });

  it('renders breadcrumb label', async () => {
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders filter tabs', async () => {
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Все')).toBeInTheDocument();
    // "Ожидает" appears in filter tab AND status badge — check both exist
    expect(screen.getAllByText('Ожидает').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Доставлен').length).toBeGreaterThanOrEqual(2);
  });

  it('renders order IDs', async () => {
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('#aaa11111')).toBeInTheDocument();
    expect(screen.getByText('#bbb22222')).toBeInTheDocument();
  });

  it('renders customer names', async () => {
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText('anon@test.com')).toBeInTheDocument();
  });

  it('renders status badges with Russian labels', async () => {
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    const badges = screen.getAllByText('Ожидает');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('renders delivery method in Russian', async () => {
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Курьер')).toBeInTheDocument();
    expect(screen.getByText('Самовывоз')).toBeInTheDocument();
  });

  it('renders pagination info', async () => {
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText(/Всего 2 заказов/)).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Админ-панель')).toBeInTheDocument();
  });

  it('passes server: true for cookie forwarding', async () => {
    await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    expect(mockApiGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ server: true }),
    );
  });

  it('passes status filter to API call', async () => {
    await AdminOrdersPage({ searchParams: Promise.resolve({ status: 'PENDING' }) });
    expect(mockApiGet).toHaveBeenCalledWith(
      expect.stringContaining('status=PENDING'),
      expect.anything(),
    );
  });

  it('shows empty message when no orders', async () => {
    mockApiGet = jest.fn().mockResolvedValue({ items: [], total: 0, page: 1, totalPages: 1 });
    const jsx = await AdminOrdersPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByText('Заказы не найдены')).toBeInTheDocument();
  });
});
