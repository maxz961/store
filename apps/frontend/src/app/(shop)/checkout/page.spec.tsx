import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const translations: Record<string, string> = {
        'checkout.step1': 'Delivery',
        'checkout.step2': 'Payment',
        'checkout.loginRequired': 'Sign in to place an order',
        'checkout.loginRequiredText': 'Authorization required to place an order',
        'checkout.loginViaGoogle': 'Sign in via Google',
        'checkout.delivery': 'Delivery method',
        'checkout.courier': 'Courier',
        'checkout.pickup': 'Pickup',
        'checkout.post': 'Post office',
        'checkout.address': 'Delivery address',
        'checkout.submit': 'Place order',
        'checkout.submitting': 'Placing order...',
        'checkout.back': 'Back',
        'checkout.intentError': 'Failed to create payment. Please try again.',
        'cart.title': 'Cart',
        'cart.total': 'Total',
        'cart.subtotal': 'Subtotal',
        'cart.items': 'items',
        'product.pieces': 'pcs.',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
      };
      return translations[key] ?? key;
    },
  }),
}));

// Mock lucide-react before importing components
jest.mock('lucide-react', () => ({
  Truck: (props: any) => <div data-testid="icon-truck" {...props} />,
  MapPin: (props: any) => <div data-testid="icon-mappin" {...props} />,
  Package: (props: any) => <div data-testid="icon-package" {...props} />,
  LogIn: (props: any) => <div data-testid="icon-login" {...props} />,
  ImageOff: (props: any) => <div data-testid="icon-imageoff" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

// Mock Stripe before importing the page
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn().mockResolvedValue(null),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div data-testid="stripe-elements">{children}</div>,
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => null,
  useElements: () => null,
}));

import CheckoutPage from './page';


const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockClearCart = jest.fn();
let mockApiPost: jest.Mock;

let mockAuthState = {
  isAuthenticated: true,
  isLoading: false,
  login: mockLogin,
};

let mockCartState = {
  items: [
    { id: 'p1', name: 'Headphones', price: 199.99, imageUrl: '', quantity: 2, slug: 'headphones', stock: 10 },
  ],
  totalPrice: () => 399.98,
  clearCart: mockClearCart,
  hydrated: true,
  setHydrated: jest.fn(),
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
  api: {
    get: jest.fn().mockResolvedValue([]),
    post: (...args: unknown[]) => mockApiPost(...args),
  },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: any) => <img {...props} />,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

const renderPage = () => render(<CheckoutPage />, { wrapper: createWrapper() });

const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText('John Smith'), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByPlaceholderText('123 Main St, Apt 5'), { target: { value: '123 Test St' } });
  fireEvent.change(screen.getByPlaceholderText('Kyiv'), { target: { value: 'Kyiv' } });
  fireEvent.change(screen.getByPlaceholderText('Kyiv region'), { target: { value: 'Kyiv region' } });
  fireEvent.change(screen.getByPlaceholderText('01001'), { target: { value: '01001' } });
};

describe('CheckoutPage', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    mockLogin.mockClear();
    mockClearCart.mockClear();
    mockApiPost = jest.fn().mockImplementation((url: string) => {
      if (url === '/payments/create-intent') return Promise.resolve({ clientSecret: 'pi_test_secret_cs' });
      if (url === '/orders') return Promise.resolve({ id: 'order-123' });
      return Promise.resolve({});
    });

    mockAuthState = { isAuthenticated: true, isLoading: false, login: mockLogin };

    mockCartState = {
      items: [
        { id: 'p1', name: 'Headphones', price: 199.99, imageUrl: '', quantity: 2, slug: 'headphones', stock: 10 },
      ],
      totalPrice: () => 399.98,
      clearCart: mockClearCart,
      hydrated: true,
      setHydrated: jest.fn(),
    };
  });

  it('shows auth prompt when not authenticated', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false };

    renderPage();

    expect(screen.getByText('Sign in to place an order')).toBeInTheDocument();
    expect(screen.getByText('Sign in via Google')).toBeInTheDocument();
  });

  it('calls login on auth button click', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false };

    renderPage();

    fireEvent.click(screen.getByText('Sign in via Google'));
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('redirects to cart when cart is empty', () => {
    mockCartState = { ...mockCartState, items: [] };

    renderPage();

    expect(mockReplace).toHaveBeenCalledWith('/cart');
  });

  it('renders step 1 (info) by default with delivery options', () => {
    renderPage();

    expect(screen.getByText('Courier')).toBeInTheDocument();
    expect(screen.getByText('Pickup')).toBeInTheDocument();
    expect(screen.getByText('Post office')).toBeInTheDocument();
  });

  it('renders step indicator showing both steps', () => {
    renderPage();

    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
  });

  it('renders address form fields', () => {
    renderPage();

    expect(screen.getByText('Full name')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Postal code')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('renders order summary with cart items', () => {
    renderPage();

    expect(screen.getAllByText('Cart').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText('2 pcs. × 199,99 ₴')).toBeInTheDocument();
  });

  it('renders total price', () => {
    renderPage();

    expect(screen.getByText('399,98 ₴')).toBeInTheDocument();
  });

  it('proceeds to step 2 after submitting valid delivery form', async () => {
    renderPage();

    fillForm();
    fireEvent.click(screen.getByText('Place order →'));

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/payments/create-intent', { amount: 399.98 });
    });

    await waitFor(() => {
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
    });
  });

  it('shows error when create-intent fails', async () => {
    mockApiPost = jest.fn().mockRejectedValue(new Error('Network error'));

    renderPage();

    fillForm();
    fireEvent.click(screen.getByText('Place order →'));

    await waitFor(() => {
      expect(screen.getByText('Failed to create payment. Please try again.')).toBeInTheDocument();
    });
  });

  it('switches delivery method', () => {
    renderPage();

    fireEvent.click(screen.getByText('Pickup'));

    const pickupButton = screen.getByText('Pickup').closest('button');
    expect(pickupButton?.className).toContain('border-primary');
  });

  it('renders breadcrumbs', () => {
    renderPage();

    expect(screen.getAllByText('Cart').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });
});
