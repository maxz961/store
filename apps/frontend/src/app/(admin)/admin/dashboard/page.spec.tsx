import { render, screen } from '@testing-library/react';

jest.mock('lucide-react', () => ({
  DollarSign: (props: any) => <div data-testid="icon-dollar" {...props} />,
  ShoppingBag: (props: any) => <div data-testid="icon-bag" {...props} />,
  TrendingUp: (props: any) => <div data-testid="icon-trend" {...props} />,
  Users: (props: any) => <div data-testid="icon-users" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: () => null,
}));

let mockApiGet: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
  },
}));

import DashboardPage from './page';

const mockSummary = {
  totalRevenue: 50000,
  ordersCount: 120,
  ordersThisMonth: 15,
  revenueThisMonth: 8000,
  ordersByStatus: [
    { status: 'PENDING', count: 5 },
    { status: 'DELIVERED', count: 80 },
    { status: 'CANCELLED', count: 3 },
  ],
  topProducts: [
    { product: { name: 'Наушники Sony', price: 2999 }, soldCount: 42 },
    { product: { name: 'Клавиатура Logitech', price: 1500 }, soldCount: 30 },
  ],
  newUsersThisMonth: 25,
  revenueByDay: [
    { date: '2026-03-01', revenue: 3000 },
    { date: '2026-03-02', revenue: 5000 },
  ],
};


describe('DashboardPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockSummary);
  });

  it('renders title', async () => {
    render(<DashboardPage />);
    expect(screen.getByText('Аналитика')).toBeInTheDocument();
  });

  it('renders stats cards after loading', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText('Общая выручка')).toBeInTheDocument();
    expect(screen.getByText('Всего заказов')).toBeInTheDocument();
    expect(screen.getByText('Заказы за месяц')).toBeInTheDocument();
    expect(screen.getByText('Новые пользователи')).toBeInTheDocument();
  });

  it('renders orders count value', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText('120')).toBeInTheDocument();
  });

  it('renders top products', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText('Наушники Sony')).toBeInTheDocument();
    expect(screen.getByText('Клавиатура Logitech')).toBeInTheDocument();
  });

  it('renders orders by status section', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText('Заказы по статусам')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    mockApiGet = jest.fn().mockRejectedValue(new Error('Forbidden'));
    render(<DashboardPage />);
    expect(await screen.findByText(/Не удалось загрузить аналитику/)).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Админ-панель')).toBeInTheDocument();
  });
});
