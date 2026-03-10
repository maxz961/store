import { render, screen } from '@testing-library/react';


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
    expect(screen.getByRole('heading', { name: 'Мои заказы' })).toBeInTheDocument();
  });

  it('renders order cards with IDs', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Заказ #12345678')).toBeInTheDocument();
    expect(screen.getByText('Заказ #87654321')).toBeInTheDocument();
  });

  it('renders order amounts', () => {
    render(<OrdersPage />);
    expect(screen.getByText('$399.98')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
  });

  it('renders status badges', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Ожидает')).toBeInTheDocument();
    expect(screen.getByText('Доставлен')).toBeInTheDocument();
  });

  it('renders item count with correct pluralization', () => {
    render(<OrdersPage />);
    expect(screen.getByText('2 товара')).toBeInTheDocument();
    expect(screen.getByText('1 товар')).toBeInTheDocument();
  });

  it('shows empty state when no orders', () => {
    mockOrdersState = { data: [], isLoading: false };
    render(<OrdersPage />);
    expect(screen.getByText('Заказов пока нет')).toBeInTheDocument();
    expect(screen.getByText('Ваши заказы появятся здесь после оформления')).toBeInTheDocument();
    expect(screen.getByText('Перейти в каталог')).toBeInTheDocument();
  });

  it('shows not authenticated state', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false, user: null };
    render(<OrdersPage />);
    expect(screen.getByText('Вы не авторизованы')).toBeInTheDocument();
    expect(screen.getByText('Войдите, чтобы увидеть свои заказы')).toBeInTheDocument();
  });

  it('shows loading skeleton without order content', () => {
    mockAuthState = { ...mockAuthState, isLoading: true };
    render(<OrdersPage />);
    expect(screen.queryByText('Заказ #12345678')).not.toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Профиль')).toBeInTheDocument();
  });
});
