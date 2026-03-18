import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ lang: 'uk', t: (k: string) => k }),
}));

jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  langToLocale: () => 'uk-UA',
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: (props: any) => <div data-testid="icon-arrow" {...props} />,
  MapPin: (props: any) => <div data-testid="icon-map" {...props} />,
  Truck: (props: any) => <div data-testid="icon-truck" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'order-abc12345' }),
  useRouter: () => ({ push: mockPush }),
}));

let mockApiGet: jest.Mock;
let mockApiPut: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    put: (...args: any[]) => mockApiPut(...args),
  },
}));

import AdminOrderDetailPage from './page';


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

const renderPage = () => render(<AdminOrderDetailPage />, { wrapper: createWrapper() });

const mockOrder = {
  id: 'order-abc12345',
  status: 'PENDING',
  deliveryMethod: 'COURIER',
  totalAmount: 5000,
  createdAt: '2026-03-05T10:00:00Z',
  user: { name: 'Иван Петров', email: 'ivan@test.com' },
  shippingAddress: {
    fullName: 'Иван Петров',
    line1: 'ул. Центральная 15',
    city: 'Киев',
    state: 'Киевская',
    postalCode: '01001',
    country: 'Украина',
  },
  orderItems: [
    { id: 'item-1', quantity: 2, price: 1500, product: { name: 'Наушники Sony' } },
    { id: 'item-2', quantity: 1, price: 2000, product: { name: 'Клавиатура' } },
  ],
};


describe('AdminOrderDetailPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockApiGet = jest.fn().mockResolvedValue(mockOrder);
    mockApiPut = jest.fn().mockResolvedValue({ ...mockOrder, status: 'PROCESSING' });
  });

  it('renders order ID in heading after loading', async () => {
    renderPage();
    const heading = await screen.findByRole('heading', { name: /abc12345/ });
    expect(heading).toBeInTheDocument();
  });

  it('renders customer name', async () => {
    renderPage();
    // Name appears in subtitle and address — just check at least one exists
    const names = await screen.findAllByText(/Иван Петров/);
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  it('renders delivery method', async () => {
    renderPage();
    expect(await screen.findByText('Courier')).toBeInTheDocument();
  });

  it('renders shipping address', async () => {
    renderPage();
    expect(await screen.findByText(/ул. Центральная 15/)).toBeInTheDocument();
    expect(screen.getByText(/Киев/)).toBeInTheDocument();
  });

  it('renders order items', async () => {
    renderPage();
    expect(await screen.findByText('Наушники Sony')).toBeInTheDocument();
    expect(screen.getByText('Клавиатура')).toBeInTheDocument();
  });

  it('renders status buttons', async () => {
    renderPage();
    // "Pending" appears in StatusBadge + status button — check both exist
    const pending = await screen.findAllByText('Pending');
    expect(pending.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
  });

  it('calls API to update status on button click', async () => {
    renderPage();
    const processingBtn = await screen.findByText('Processing');
    fireEvent.click(processingBtn);
    await waitFor(() => {
      expect(mockApiPut).toHaveBeenCalledWith('/orders/order-abc12345/status', { status: 'PROCESSING' });
    });
  });

  it('renders breadcrumbs', async () => {
    renderPage();
    expect(await screen.findByText('Orders')).toBeInTheDocument();
  });

  it('redirects to orders on fetch error', async () => {
    mockApiGet = jest.fn().mockRejectedValue(new Error('Not found'));
    renderPage();
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/orders');
    });
  });
});
