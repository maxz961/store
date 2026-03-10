import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock lucide-react before importing components
jest.mock('lucide-react', () => ({
  Truck: (props: any) => <div data-testid="icon-truck" {...props} />,
  MapPin: (props: any) => <div data-testid="icon-mappin" {...props} />,
  Package: (props: any) => <div data-testid="icon-package" {...props} />,
  LogIn: (props: any) => <div data-testid="icon-login" {...props} />,
  ImageOff: (props: any) => <div data-testid="icon-imageoff" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

import CheckoutPage from './page';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockClearCart = jest.fn();
const mockApiPost = jest.fn();

let mockAuthState = {
  isAuthenticated: true,
  isLoading: false,
  login: mockLogin,
};

let mockCartState = {
  items: [
    { id: 'p1', name: 'Наушники', price: 199.99, imageUrl: '', quantity: 2, slug: 'headphones', stock: 10 },
  ],
  totalPrice: () => 399.98,
  clearCart: mockClearCart,
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

jest.mock('@/store/cart', () => ({
  useCartStore: (selector?: (state: any) => any) =>
    selector ? selector(mockCartState) : mockCartState,
}));

jest.mock('@/lib/api', () => ({
  api: { post: (...args: unknown[]) => mockApiPost(...args) },
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('CheckoutPage', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    mockLogin.mockClear();
    mockClearCart.mockClear();
    mockApiPost.mockClear();

    mockAuthState = {
      isAuthenticated: true,
      isLoading: false,
      login: mockLogin,
    };

    mockCartState = {
      items: [
        { id: 'p1', name: 'Наушники', price: 199.99, imageUrl: '', quantity: 2, slug: 'headphones', stock: 10 },
      ],
      totalPrice: () => 399.98,
      clearCart: mockClearCart,
    };
  });

  it('shows auth prompt when not authenticated', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false };

    render(<CheckoutPage />);

    expect(screen.getByText('Войдите, чтобы оформить заказ')).toBeInTheDocument();
    expect(screen.getByText('Войти через Google')).toBeInTheDocument();
  });

  it('calls login on auth button click', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false };

    render(<CheckoutPage />);

    fireEvent.click(screen.getByText('Войти через Google'));
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('redirects to cart when cart is empty', () => {
    mockCartState = { ...mockCartState, items: [] };

    render(<CheckoutPage />);

    expect(mockReplace).toHaveBeenCalledWith('/cart');
  });

  it('renders delivery method options', () => {
    render(<CheckoutPage />);

    expect(screen.getByText('Курьер')).toBeInTheDocument();
    expect(screen.getByText('Самовывоз')).toBeInTheDocument();
    expect(screen.getByText('Почта')).toBeInTheDocument();
  });

  it('renders address form fields', () => {
    render(<CheckoutPage />);

    expect(screen.getByText('Полное имя')).toBeInTheDocument();
    expect(screen.getByText('Адрес')).toBeInTheDocument();
    expect(screen.getByText('Город')).toBeInTheDocument();
    expect(screen.getByText('Почтовый индекс')).toBeInTheDocument();
    expect(screen.getByText('Страна')).toBeInTheDocument();
  });

  it('renders order summary with cart items', () => {
    render(<CheckoutPage />);

    expect(screen.getByText('Ваш заказ')).toBeInTheDocument();
    expect(screen.getByText('Наушники')).toBeInTheDocument();
    expect(screen.getByText('2 шт. × $199.99')).toBeInTheDocument();
  });

  it('renders total price', () => {
    render(<CheckoutPage />);

    expect(screen.getByText('$399.98')).toBeInTheDocument();
  });

  it('submits order successfully', async () => {
    mockApiPost.mockResolvedValue({ id: 'order-123' });

    render(<CheckoutPage />);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText('Иван Петров'), { target: { value: 'Тест Юзер' } });
    fireEvent.change(screen.getByPlaceholderText('ул. Шевченко, 10, кв. 5'), { target: { value: 'ул. Тестовая, 1' } });
    fireEvent.change(screen.getByPlaceholderText('Киев'), { target: { value: 'Киев' } });
    fireEvent.change(screen.getByPlaceholderText('Киевская обл.'), { target: { value: 'Киевская' } });
    fireEvent.change(screen.getByPlaceholderText('01001'), { target: { value: '01001' } });

    fireEvent.click(screen.getByText('Оформить заказ'));

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/orders', {
        deliveryMethod: 'COURIER',
        shippingAddress: expect.objectContaining({ fullName: 'Тест Юзер', city: 'Киев' }),
        items: [{ productId: 'p1', quantity: 2 }],
      });
    });

    expect(mockClearCart).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/account/orders/order-123');
  });

  it('shows error when order fails', async () => {
    mockApiPost.mockRejectedValue(new Error('Недостаточно товара'));

    render(<CheckoutPage />);

    fireEvent.change(screen.getByPlaceholderText('Иван Петров'), { target: { value: 'Тест' } });
    fireEvent.change(screen.getByPlaceholderText('ул. Шевченко, 10, кв. 5'), { target: { value: 'Адрес' } });
    fireEvent.change(screen.getByPlaceholderText('Киев'), { target: { value: 'Киев' } });
    fireEvent.change(screen.getByPlaceholderText('Киевская обл.'), { target: { value: 'Обл' } });
    fireEvent.change(screen.getByPlaceholderText('01001'), { target: { value: '01001' } });

    fireEvent.click(screen.getByText('Оформить заказ'));

    await waitFor(() => {
      expect(screen.getByText('Недостаточно товара')).toBeInTheDocument();
    });

    expect(mockClearCart).not.toHaveBeenCalled();
  });

  it('switches delivery method', () => {
    render(<CheckoutPage />);

    fireEvent.click(screen.getByText('Самовывоз'));

    // Самовывоз should now be selected (active border)
    const pickupButton = screen.getByText('Самовывоз').closest('button');
    expect(pickupButton?.className).toContain('border-primary');
  });

  it('renders breadcrumbs', () => {
    render(<CheckoutPage />);

    expect(screen.getByText('Корзина')).toBeInTheDocument();
    expect(screen.getByText('Оформление заказа')).toBeInTheDocument();
  });
});
