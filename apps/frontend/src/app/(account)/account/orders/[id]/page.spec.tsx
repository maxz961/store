import { Suspense } from 'react';
import { render, screen, act } from '@testing-library/react';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'nav.home': 'Home',
        'orders.title': 'My orders',
        'orders.order': 'Order',
        'orders.address': 'Address',
        'orders.backToOrders': 'Back to orders',
        'orders.courier': 'Courier',
        'orders.pickup': 'Pickup',
        'orders.post': 'Post office',
        'admin.order.items': 'Items',
        'cart.total': 'Total',
        'product.pieces': 'pcs.',
        'product.noPhoto': 'No photo',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.notFound': 'Not found',
      };
      return map[key] ?? key;
    },
  }),
}));

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
    fullName: 'Ivan Petrov',
    line1: '10 Shevchenko St',
    city: 'Kyiv',
    state: 'Kyiv region',
    postalCode: '01001',
    country: 'UA',
  },
  orderItems: [
    {
      id: 'item-1',
      quantity: 2,
      price: '199.99',
      product: { id: 'p1', name: 'Headphones', slug: 'headphones', images: ['https://example.com/img.jpg'] },
    },
  ],
};

jest.mock('@/lib/hooks/useOrders', () => ({
  useOrder: () => mockOrderState,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
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
    expect(screen.getByText('Order #12345678')).toBeInTheDocument();
  });

  it('renders status badge', async () => {
    await renderPage();
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('renders delivery method badge', async () => {
    await renderPage();
    expect(screen.getByText('Courier')).toBeInTheDocument();
  });

  it('renders order item name and quantity', async () => {
    await renderPage();
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText('2 pcs. × 199,99 ₴')).toBeInTheDocument();
  });

  it('renders total amount', async () => {
    await renderPage();
    expect(screen.getAllByText('399,98 ₴').length).toBeGreaterThanOrEqual(1);
  });

  it('renders shipping address for non-pickup orders', async () => {
    await renderPage();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText(/Ivan Petrov/)).toBeInTheDocument();
    expect(screen.getByText(/Kyiv/)).toBeInTheDocument();
  });

  it('hides address section for pickup orders', async () => {
    mockOrderState = {
      ...mockOrderState,
      data: { ...mockOrder, deliveryMethod: 'PICKUP' },
    };
    await renderPage();
    expect(screen.queryByText('Address')).not.toBeInTheDocument();
  });

  it('shows error state when order not found', async () => {
    mockOrderState = { data: null, isLoading: false, error: new Error('Not found') };
    await renderPage();
    expect(screen.getByText('Not found')).toBeInTheDocument();
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByText('Back to orders')).toBeInTheDocument();
  });

  it('shows loading state without order content', async () => {
    mockOrderState = { data: null, isLoading: true, error: null };
    await renderPage();
    expect(screen.queryByText('Headphones')).not.toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    await renderPage();
    expect(screen.getByText('My orders')).toBeInTheDocument();
  });
});
