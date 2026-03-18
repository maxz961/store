import { render, screen } from '@testing-library/react';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'orders.order': 'Order',
        'orders.empty': 'No orders yet',
        'orders.emptyText': 'Go to the catalog and place your first order',
        'orders.notAuth': 'You are not signed in',
        'orders.notAuthText': 'Sign in to view your orders',
        'orders.login': 'Sign in',
        'cart.items': 'items',
        'cart.browseCatalog': 'Go to catalog',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('lucide-react', () => ({
  Package: (props: any) => <div data-testid="icon-package" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  UserCircle: (props: any) => <div data-testid="icon-user" {...props} />,
}));

import OrdersPage from './page';


let mockAuthState: any;
let mockOrdersState: any;

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

jest.mock('@/lib/hooks/useOrders', () => ({
  useMyOrders: () => mockOrdersState,
}));

const mockOrders = [
  {
    id: 'order-12345678',
    status: 'PENDING',
    totalAmount: '399.98',
    createdAt: '2026-03-01T10:00:00Z',
    orderItems: [{ quantity: 2 }],
  },
  {
    id: 'order-87654321',
    status: 'DELIVERED',
    totalAmount: '149.99',
    createdAt: '2026-02-20T15:00:00Z',
    orderItems: [{ quantity: 1 }],
  },
];

describe('OrdersPage', () => {
  beforeEach(() => {
    mockAuthState = {
      user: { id: 'u1', email: 'test@example.com', name: 'Иван', role: 'CUSTOMER' },
      isLoading: false,
      isAuthenticated: true,
    };
    mockOrdersState = {
      data: mockOrders,
      isLoading: false,
    };
  });

  it('renders orders title', () => {
    render(<OrdersPage />);
    expect(screen.getByText('My Orders')).toBeInTheDocument();
  });

  it('renders order cards with IDs', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Order #12345678')).toBeInTheDocument();
    expect(screen.getByText('Order #87654321')).toBeInTheDocument();
  });

  it('renders order amounts', () => {
    render(<OrdersPage />);
    expect(screen.getByText('399,98 ₴')).toBeInTheDocument();
    expect(screen.getByText('149,99 ₴')).toBeInTheDocument();
  });

  it('renders status badges', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('renders item count with correct pluralization', () => {
    render(<OrdersPage />);
    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getByText('1 items')).toBeInTheDocument();
  });

  it('shows empty state when no orders', () => {
    mockOrdersState = { data: [], isLoading: false };
    render(<OrdersPage />);
    expect(screen.getByText('No orders yet')).toBeInTheDocument();
    expect(screen.getByText('Go to the catalog and place your first order')).toBeInTheDocument();
    expect(screen.getByText('Go to catalog')).toBeInTheDocument();
  });

  it('shows not authenticated state', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false, user: null };
    render(<OrdersPage />);
    expect(screen.getByText('You are not signed in')).toBeInTheDocument();
    expect(screen.getByText('Sign in to view your orders')).toBeInTheDocument();
  });

  it('shows loading skeleton without order content', () => {
    mockAuthState = { ...mockAuthState, isLoading: true };
    render(<OrdersPage />);
    expect(screen.queryByText('Заказ #12345678')).not.toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
