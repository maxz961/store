import { render, screen, fireEvent } from '@testing-library/react';


jest.mock('lucide-react', () => ({
  ShoppingCart: (props: any) => <div data-testid="icon-cart" {...props} />,
  Sun: (props: any) => <div data-testid="icon-sun" {...props} />,
  Moon: (props: any) => <div data-testid="icon-moon" {...props} />,
  Store: (props: any) => <div data-testid="icon-store" {...props} />,
  Search: (props: any) => <div data-testid="icon-search" {...props} />,
  User: (props: any) => <div data-testid="icon-user" {...props} />,
  Package: (props: any) => <div data-testid="icon-package" {...props} />,
  LogOut: (props: any) => <div data-testid="icon-logout" {...props} />,
  LayoutDashboard: (props: any) => <div data-testid="icon-dashboard" {...props} />,
}));

import { Header } from './Header';


const mockSetTheme = jest.fn();
const mockUpdate = jest.fn();
const mockLogin = jest.fn();
const mockLogout = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: mockSetTheme }),
}));

jest.mock('@/lib/hooks/useProductParams', () => ({
  useProductParams: () => ({ get: () => '', update: mockUpdate }),
}));

let mockUnreadCount: number;

jest.mock('@/lib/hooks/useSupport', () => ({
  useMyUnreadCount: () => ({ data: mockUnreadCount }),
}));

let mockAuthState: any;

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

let mockCartItems: any[];

jest.mock('@/store/cart', () => ({
  useCartStore: (selector?: (state: any) => any) =>
    selector ? selector({ items: mockCartItems }) : { items: mockCartItems },
}));

describe('Header', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockUpdate.mockClear();
    mockLogin.mockClear();
    mockLogout.mockClear();

    mockAuthState = {
      user: { id: 'u1', email: 'test@example.com', name: 'Иван Петров', image: null, role: 'CUSTOMER' },
      isAuthenticated: true,
      isAdmin: false,
      login: mockLogin,
      logout: mockLogout,
    };

    mockCartItems = [{ id: 'p1', quantity: 3 }];
    mockUnreadCount = 0;
  });

  it('renders logo text', () => {
    render(<Header />);
    expect(screen.getByText('Store')).toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    render(<Header />);
    expect(screen.getByPlaceholderText('Поиск товаров...')).toBeInTheDocument();
  });

  it('renders cart badge with item count', () => {
    render(<Header />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides cart badge when cart is empty', () => {
    mockCartItems = [];
    render(<Header />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders user initials when authenticated without avatar', () => {
    render(<Header />);
    expect(screen.getByText('ИП')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false, user: null };
    render(<Header />);
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('calls login on login button click', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false, user: null };
    render(<Header />);
    fireEvent.click(screen.getByText('Войти'));
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('opens dropdown menu on avatar click', () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText('Меню пользователя'));
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    expect(screen.getByText('Мои заказы')).toBeInTheDocument();
    expect(screen.getByText('Выйти')).toBeInTheDocument();
  });

  it('shows user name and email in dropdown', () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText('Меню пользователя'));
    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('shows admin link when user is admin', () => {
    mockAuthState = { ...mockAuthState, isAdmin: true };
    render(<Header />);
    fireEvent.click(screen.getByLabelText('Меню пользователя'));
    expect(screen.getByText('Админ-панель')).toBeInTheDocument();
  });

  it('hides admin link for regular users', () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText('Меню пользователя'));
    expect(screen.queryByText('Админ-панель')).not.toBeInTheDocument();
  });

  it('calls logout on logout button click', () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText('Меню пользователя'));
    fireEvent.click(screen.getByText('Выйти'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('submits search form with query', () => {
    render(<Header />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.change(input, { target: { value: 'наушники' } });
    fireEvent.submit(input.closest('form')!);
    expect(mockUpdate).toHaveBeenCalledWith({ search: 'наушники' });
  });

  it('shows unread dot on avatar when there are unread messages', () => {
    mockUnreadCount = 2;
    render(<Header />);
    expect(screen.getByTestId('unread-dot')).toBeInTheDocument();
  });

  it('hides unread dot when no unread messages', () => {
    mockUnreadCount = 0;
    render(<Header />);
    expect(screen.queryByTestId('unread-dot')).not.toBeInTheDocument();
  });
});
