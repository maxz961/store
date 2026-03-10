import { Suspense } from 'react';
import { render, screen, act } from '@testing-library/react';

jest.mock('lucide-react', () => ({
  Package: (props: any) => <div data-testid="icon-package" {...props} />,
  ArrowLeft: (props: any) => <div data-testid="icon-arrow" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

import OrderDetailPage from './page';

let mockOrderState: any;

const mockOrder = {
  id: 'order-12345678',
  status: 'PROCESSING',
  totalAmount: '399.98',
  currency: 'USD',
  deliveryMethod: 'COURIER',
  createdAt: '2026-03-01T10:30:00Z',
  shippingAddress: {
    fullName: 'Иван Петров',
    line1: 'ул. Шевченко, 10',
    city: 'Киев',
    state: 'Киевская',
    postalCode: '01001',
    country: 'UA',
  },
  orderItems: [
    {
      id: 'item-1',
      quantity: 2,
      price: '199.99',
      product: { id: 'p1', name: 'Наушники', slug: 'headphones', images: ['https://example.com/img.jpg'] },
    },
  ],
};

jest.mock('@/lib/hooks/useOrders', () => ({
  useOrder: () => mockOrderState,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('OrderDetailPage', () => {
  beforeEach(() => {
    mockOrderState = {
      data: { ...mockOrder },
      isLoading: false,
      error: null,
    };
  });

  const renderPage = async () => {
    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <OrderDetailPage params={Promise.resolve({ id: 'order-12345678' })} />
        </Suspense>
      );
    });
  };

  it('renders order title with last 8 chars of ID', async () => {
    await renderPage();
    expect(screen.getByText('Заказ #12345678')).toBeInTheDocument();
  });

  it('renders status badge', async () => {
    await renderPage();
    expect(screen.getByText('Обрабатывается')).toBeInTheDocument();
  });

  it('renders delivery method badge', async () => {
    await renderPage();
    expect(screen.getByText('Курьер')).toBeInTheDocument();
  });

  it('renders order item name and quantity', async () => {
    await renderPage();
    expect(screen.getByText('Наушники')).toBeInTheDocument();
    expect(screen.getByText('2 шт. × $199.99')).toBeInTheDocument();
  });

  it('renders total amount', async () => {
    await renderPage();
    expect(screen.getAllByText('$399.98').length).toBeGreaterThanOrEqual(1);
  });

  it('renders shipping address for non-pickup orders', async () => {
    await renderPage();
    expect(screen.getByText('Адрес доставки')).toBeInTheDocument();
    expect(screen.getByText(/Иван Петров/)).toBeInTheDocument();
    expect(screen.getByText(/Киев/)).toBeInTheDocument();
  });

  it('hides address section for pickup orders', async () => {
    mockOrderState = {
      ...mockOrderState,
      data: { ...mockOrder, deliveryMethod: 'PICKUP' },
    };
    await renderPage();
    expect(screen.queryByText('Адрес доставки')).not.toBeInTheDocument();
  });

  it('shows error state when order not found', async () => {
    mockOrderState = { data: null, isLoading: false, error: new Error('Not found') };
    await renderPage();
    expect(screen.getByText('Заказ не найден')).toBeInTheDocument();
    expect(screen.getByText('Возможно, заказ был удалён или вы не имеете к нему доступа')).toBeInTheDocument();
    expect(screen.getByText('К заказам')).toBeInTheDocument();
  });

  it('shows loading state without order content', async () => {
    mockOrderState = { data: null, isLoading: true, error: null };
    await renderPage();
    expect(screen.queryByText('Наушники')).not.toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    await renderPage();
    expect(screen.getByText('Мои заказы')).toBeInTheDocument();
  });
});
