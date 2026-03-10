import { render, screen, fireEvent, waitFor } from '@testing-library/react';

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
    render(<AdminOrderDetailPage />);
    const heading = await screen.findByRole('heading', { name: /abc12345/ });
    expect(heading).toBeInTheDocument();
  });

  it('renders customer name', async () => {
    render(<AdminOrderDetailPage />);
    // Name appears in subtitle and address — just check at least one exists
    const names = await screen.findAllByText(/Иван Петров/);
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  it('renders delivery method in Russian', async () => {
    render(<AdminOrderDetailPage />);
    expect(await screen.findByText('Курьер')).toBeInTheDocument();
  });

  it('renders shipping address', async () => {
    render(<AdminOrderDetailPage />);
    expect(await screen.findByText(/ул. Центральная 15/)).toBeInTheDocument();
    expect(screen.getByText(/Киев/)).toBeInTheDocument();
  });

  it('renders order items', async () => {
    render(<AdminOrderDetailPage />);
    expect(await screen.findByText('Наушники Sony')).toBeInTheDocument();
    expect(screen.getByText('Клавиатура')).toBeInTheDocument();
  });

  it('renders status buttons', async () => {
    render(<AdminOrderDetailPage />);
    // "Ожидает" appears in StatusBadge + status button — check both exist
    const pending = await screen.findAllByText('Ожидает');
    expect(pending.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Обрабатывается')).toBeInTheDocument();
    expect(screen.getByText('Отправлен')).toBeInTheDocument();
  });

  it('calls API to update status on button click', async () => {
    render(<AdminOrderDetailPage />);
    const processingBtn = await screen.findByText('Обрабатывается');
    fireEvent.click(processingBtn);
    await waitFor(() => {
      expect(mockApiPut).toHaveBeenCalledWith('/orders/order-abc12345/status', { status: 'PROCESSING' });
    });
  });

  it('renders breadcrumbs', async () => {
    render(<AdminOrderDetailPage />);
    expect(await screen.findByText('Заказы')).toBeInTheDocument();
  });

  it('redirects to orders on fetch error', async () => {
    mockApiGet = jest.fn().mockRejectedValue(new Error('Not found'));
    render(<AdminOrderDetailPage />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/orders');
    });
  });
});
