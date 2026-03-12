import { render, screen } from '@testing-library/react';


jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: any) => <img {...props} />,
}));
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('lucide-react', () => ({
  MessageCircle: (props: any) => <div data-testid="icon-message" {...props} />,
}));
jest.mock('@/lib/utils', () => ({
  getInitials: (name: string | null, email: string) => name?.slice(0, 2).toUpperCase() ?? email.slice(0, 2).toUpperCase(),
}));

let mockThreads: any[];
let mockIsLoading: boolean;

jest.mock('@/lib/hooks/useSupport', () => ({
  useAdminThreads: () => ({ data: mockThreads, isLoading: mockIsLoading }),
}));

jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

import AdminSupportPage from './page';


describe('AdminSupportPage', () => {
  beforeEach(() => {
    mockThreads = [];
    mockIsLoading = false;
  });

  it('renders without crashing', () => {
    render(<AdminSupportPage />);
  });

  it('shows empty state when no threads', () => {
    render(<AdminSupportPage />);
    expect(screen.getByText('Нет обращений от пользователей')).toBeInTheDocument();
  });

  it('shows spinner while loading', () => {
    mockIsLoading = true;
    render(<AdminSupportPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders thread list with user info', () => {
    mockThreads = [
      {
        user: { id: 'u1', name: 'Иван', email: 'ivan@example.com', image: null },
        lastMessage: { id: 'm1', content: 'Помогите', fromAdmin: false, readAt: null, createdAt: '2026-01-01T10:00:00Z' },
        unreadCount: 3,
      },
    ];
    render(<AdminSupportPage />);
    expect(screen.getByText('Иван')).toBeInTheDocument();
    expect(screen.getByText('ivan@example.com')).toBeInTheDocument();
    expect(screen.getByText('Помогите')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows admin prefix on last message if fromAdmin', () => {
    mockThreads = [
      {
        user: { id: 'u1', name: 'Мария', email: 'maria@example.com', image: null },
        lastMessage: { id: 'm1', content: 'Ответ', fromAdmin: true, readAt: null, createdAt: '2026-01-01T10:00:00Z' },
        unreadCount: 0,
      },
    ];
    render(<AdminSupportPage />);
    expect(screen.getByText(/Вы:.*Ответ/) ?? screen.queryByText('Вы: Ответ')).toBeTruthy();
  });

  it('renders avatar fallback when user has no image', () => {
    mockThreads = [
      {
        user: { id: 'u1', name: 'Тест', email: 'test@example.com', image: null },
        lastMessage: null,
        unreadCount: 0,
      },
    ];
    render(<AdminSupportPage />);
    expect(screen.getByText('ТЕ')).toBeInTheDocument();
  });

  it('renders link to user thread', () => {
    mockThreads = [
      {
        user: { id: 'u1', name: 'Лена', email: 'lena@example.com', image: null },
        lastMessage: null,
        unreadCount: 0,
      },
    ];
    render(<AdminSupportPage />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/admin/support/u1');
  });
});
