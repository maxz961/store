import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './page';


const mockReplace = jest.fn();
const mockLogin = jest.fn();
let mockAuthState = {
  isAuthenticated: false,
  isLoading: false,
  login: mockLogin,
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockLogin.mockClear();
    mockAuthState = {
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
    };
  });

  it('renders login form when not authenticated', () => {
    render(<LoginPage />);

    expect(screen.getByText('Вход в магазин')).toBeInTheDocument();
    expect(screen.getByText('Продолжить с Google')).toBeInTheDocument();
    expect(screen.getByText('Мы не храним пароли — вход только через Google')).toBeInTheDocument();
  });

  it('renders nothing while loading', () => {
    mockAuthState = { ...mockAuthState, isLoading: true };

    const { container } = render(<LoginPage />);

    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when already authenticated', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: true };

    const { container } = render(<LoginPage />);

    expect(container.innerHTML).toBe('');
  });

  it('redirects to /products when authenticated', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: true };

    render(<LoginPage />);

    expect(mockReplace).toHaveBeenCalledWith('/products');
  });

  it('calls login on Google button click', () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText('Продолжить с Google'));

    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('shows subtitle about orders and delivery', () => {
    render(<LoginPage />);

    expect(screen.getByText('Войдите, чтобы оформлять заказы и отслеживать доставку')).toBeInTheDocument();
  });
});
