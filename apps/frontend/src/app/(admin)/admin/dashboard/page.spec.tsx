
jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'admin.dashboard.title': 'Dashboard',
        'admin.dashboard.totalRevenue': 'Total Revenue',
        'admin.dashboard.thisMonth': 'this month',
        'admin.dashboard.totalOrders': 'Total Orders',
        'admin.dashboard.ordersThisMonth': 'Monthly Orders',
        'admin.dashboard.newUsers': 'New Users',
        'admin.dashboard.byStatus': 'Orders by Status',
        'admin.dashboard.pieces': 'pcs.',
        'admin.dashboard.unknown': 'Unknown',
        'admin.dashboard.noSalesData': 'No sales data',
        'admin.dashboard.revenueByCategory': 'Revenue by Category',
        'admin.dashboard.deliveryMethods': 'Delivery Methods',
        'admin.dashboard.ordersLabel': 'orders',
        'admin.dashboard.ratingDistribution': 'Rating Distribution',
        'admin.dashboard.reviews': 'reviews',
        'admin.dashboard.noReviews': 'No reviews',
        'admin.dashboard.revenue30days': 'Revenue (30 days)',
        'admin.dashboard.aov30days': 'Avg. Order (30 days)',
        'admin.dashboard.aov': 'Avg. order',
        'admin.dashboard.lowStock': 'Low Stock',
        'admin.dashboard.allInStock': 'All products in stock',
        'admin.dashboard.sold': 'sold',
        'admin.dashboard.loadError': 'Failed to load analytics. Make sure you are an administrator.',
        'admin.dashboard.revenue': 'Revenue',
        'admin.dashboard.topProducts': 'Top products',
        'product.outOfStock': 'Out of stock',
        'common.noData': 'No data',
      };
      return map[key] ?? key;
    },
  }),
}));

import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  DollarSign: (props: any) => <div data-testid="icon-dollar" {...props} />,
  ShoppingBag: (props: any) => <div data-testid="icon-bag" {...props} />,
  TrendingUp: (props: any) => <div data-testid="icon-trend" {...props} />,
  Users: (props: any) => <div data-testid="icon-users" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  AlertTriangle: (props: any) => <div data-testid="icon-alert" {...props} />,
  CheckCircle2: (props: any) => <div data-testid="icon-check" {...props} />,
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ children }: any) => <div data-testid="bar">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: () => null,
}));

jest.mock('next/image', () => {
  const MockImage = (props: any) => <div data-testid="next-image" {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

let mockApiGet: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
  },
}));

import DashboardPage from './page';


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

const renderPage = () => render(<DashboardPage />, { wrapper: createWrapper() });

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
  revenueByCategory: [
    { categoryName: 'Электроника', revenue: 30000 },
    { categoryName: 'Одежда', revenue: 15000 },
  ],
  aovByDay: [
    { date: '2026-03-01', aov: 850 },
    { date: '2026-03-02', aov: 920 },
  ],
  averageOrderValue: 416.67,
  deliveryMethodDistribution: [
    { method: 'COURIER', count: 60 },
    { method: 'PICKUP', count: 40 },
    { method: 'POST', count: 20 },
  ],
  ratingDistribution: [
    { rating: 5, count: 15 },
    { rating: 4, count: 8 },
    { rating: 3, count: 3 },
  ],
  lowStockProducts: [
    { id: 'p1', name: 'USB-кабель', nameEn: 'USB Cable', slug: 'usb-cable', stock: 2, image: 'img.jpg' },
    { id: 'p2', name: 'Чехол для телефона', nameEn: null, slug: 'phone-case', stock: 0, image: null },
  ],
};


describe('DashboardPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockSummary);
  });

  it('renders stats cards after loading', async () => {
    renderPage();
    expect(await screen.findByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Monthly Orders')).toBeInTheDocument();
    expect(screen.getByText('New Users')).toBeInTheDocument();
  });

  it('renders orders count value', async () => {
    renderPage();
    expect(await screen.findByText('120')).toBeInTheDocument();
  });

  it('renders top products', async () => {
    renderPage();
    expect(await screen.findByText('Наушники Sony')).toBeInTheDocument();
    expect(screen.getByText('Клавиатура Logitech')).toBeInTheDocument();
  });

  it('renders orders by status section', async () => {
    renderPage();
    expect(await screen.findByText('Orders by Status')).toBeInTheDocument();
  });

  it('renders revenue by category section', async () => {
    renderPage();
    expect(await screen.findByText('Revenue by Category')).toBeInTheDocument();
  });

  it('renders delivery method section', async () => {
    renderPage();
    expect(await screen.findByText('Delivery Methods')).toBeInTheDocument();
  });

  it('renders rating distribution section', async () => {
    renderPage();
    expect(await screen.findByText('Rating Distribution')).toBeInTheDocument();
  });

  it('renders AOV trend chart', async () => {
    renderPage();
    expect(await screen.findByText('Avg. Order (30 days)')).toBeInTheDocument();
  });

  it('renders low stock warning', async () => {
    renderPage();
    expect(await screen.findByText('Low Stock')).toBeInTheDocument();
    // lang='en' in mock → shows nameEn when available, falls back to name when nameEn is null
    expect(screen.getByText('USB Cable')).toBeInTheDocument();
    expect(screen.getByText('Чехол для телефона')).toBeInTheDocument(); // nameEn is null → fallback
  });

  it('shows nameEn in Low Stock widget when language is EN (regression: names were always shown in Ukrainian)', async () => {
    renderPage();
    expect(await screen.findByText('USB Cable')).toBeInTheDocument();
  });

  it('shows stock badge for low stock products', async () => {
    renderPage();
    expect(await screen.findByText('2 pcs.')).toBeInTheDocument();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('shows "all in stock" message when no low stock products', async () => {
    mockApiGet = jest.fn().mockResolvedValue({ ...mockSummary, lowStockProducts: [] });
    renderPage();
    expect(await screen.findByText('All products in stock')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    mockApiGet = jest.fn().mockRejectedValue(new Error('Forbidden'));
    renderPage();
    expect(await screen.findByText(/Failed to load analytics/)).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders loading skeletons', () => {
    mockApiGet = jest.fn().mockReturnValue(new Promise(() => {}));
    renderPage();
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(4);
  });
});
