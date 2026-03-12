import { render, screen, fireEvent } from '@testing-library/react';


jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: any) => <img {...props} />,
}));

jest.mock('lucide-react', () => ({
  Package: (props: any) => <div data-testid="icon-package" {...props} />,
  LogOut: (props: any) => <div data-testid="icon-logout" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  UserCircle: (props: any) => <div data-testid="icon-user" {...props} />,
  Headset: (props: any) => <div data-testid="icon-headset" {...props} />,
  Heart: (props: any) => <div data-testid="icon-heart" {...props} />,
}));

import ProfilePage from './page';


const mockLogout = jest.fn();

let mockAuthState: any;

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    mockLogout.mockClear();
    mockAuthState = {
      user: {
        id: 'u1',
        email: 'test@example.com',
        name: 'Иван Петров',
        image: 'https://example.com/avatar.jpg',
        role: 'CUSTOMER',
        createdAt: '2026-01-15T00:00:00Z',
      },
      isLoading: false,
      isAuthenticated: true,
      logout: mockLogout,
    };
  });

  it('renders profile title', () => {
    render(<ProfilePage />);
    expect(screen.getByRole('heading', { name: 'Профиль' })).toBeInTheDocument();
  });

  it('renders user name and email', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders member since date', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/Участник с/)).toBeInTheDocument();
  });

  it('renders avatar image when user has image', () => {
    const { container } = render(<ProfilePage />);
    const img = container.querySelector('img[src="https://example.com/avatar.jpg"]');
    expect(img).toBeInTheDocument();
  });

  it('renders initials when user has no image', () => {
    mockAuthState = {
      ...mockAuthState,
      user: { ...mockAuthState.user, image: null },
    };
    render(<ProfilePage />);
    expect(screen.getByText('ИП')).toBeInTheDocument();
  });

  it('calls logout on button click', () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText('Выйти'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('shows not authenticated state', () => {
    mockAuthState = { ...mockAuthState, isAuthenticated: false, user: null };
    render(<ProfilePage />);
    expect(screen.getByText('Вы не авторизованы')).toBeInTheDocument();
    expect(screen.getByText('Войдите, чтобы увидеть свой профиль')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Быстрые ссылки')).toBeInTheDocument();
    expect(screen.getByText('Мои заказы')).toBeInTheDocument();
    expect(screen.getByText('История покупок и статусы доставки')).toBeInTheDocument();
  });

  it('shows loading skeleton without user info', () => {
    mockAuthState = { ...mockAuthState, isLoading: true };
    render(<ProfilePage />);
    expect(screen.queryByText('Иван Петров')).not.toBeInTheDocument();
    expect(screen.queryByText('Быстрые ссылки')).not.toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Главная')).toBeInTheDocument();
  });
});
