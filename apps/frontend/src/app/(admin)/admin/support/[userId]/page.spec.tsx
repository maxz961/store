import { render, screen, fireEvent } from '@testing-library/react';


window.HTMLElement.prototype.scrollIntoView = jest.fn();

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
  ArrowLeft: (props: any) => <div data-testid="icon-arrow" {...props} />,
}));
jest.mock('@/lib/utils', () => ({
  getInitials: () => 'ИВ',
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));
jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return { ...actual, use: () => ({ userId: 'user-1' }) };
});

let mockData: any;
let mockIsLoading: boolean;
let mockReplyMutate: jest.Mock;

jest.mock('@/lib/hooks/useSupport', () => ({
  useAdminThread: () => ({ data: mockData, isLoading: mockIsLoading }),
  useAdminReply: () => ({ mutate: mockReplyMutate, isPending: false }),
}));

jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

import AdminSupportThreadPage from './page';


const mockParams = Promise.resolve({ userId: 'user-1' });

const mockUser = { id: 'user-1', name: 'Иван', email: 'ivan@example.com', image: null };


describe('AdminSupportThreadPage', () => {
  beforeEach(() => {
    mockIsLoading = false;
    mockReplyMutate = jest.fn();
    mockData = { user: mockUser, messages: [] };
  });

  it('renders without crashing', () => {
    render(<AdminSupportThreadPage params={mockParams} />);
  });

  it('shows spinner while loading', () => {
    mockIsLoading = true;
    mockData = undefined;
    render(<AdminSupportThreadPage params={mockParams} />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows not found state when data is undefined after load', () => {
    mockData = undefined;
    render(<AdminSupportThreadPage params={mockParams} />);
    expect(screen.getByText('Пользователь не найден')).toBeInTheDocument();
  });

  it('renders user name and email', () => {
    render(<AdminSupportThreadPage params={mockParams} />);
    expect(screen.getByText('Иван')).toBeInTheDocument();
    expect(screen.getByText('ivan@example.com')).toBeInTheDocument();
  });

  it('renders back link', () => {
    render(<AdminSupportThreadPage params={mockParams} />);
    expect(screen.getByText('Все обращения')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/admin/support');
  });

  it('shows empty state when no messages', () => {
    render(<AdminSupportThreadPage params={mockParams} />);
    expect(screen.getByText('Нет сообщений')).toBeInTheDocument();
  });

  it('renders messages with correct labels', () => {
    mockData = {
      user: mockUser,
      messages: [
        { id: 'm1', content: 'Вопрос от юзера', fromAdmin: false, readAt: null, createdAt: '2026-01-01T10:00:00Z' },
        { id: 'm2', content: 'Ответ поддержки', fromAdmin: true, readAt: null, createdAt: '2026-01-01T10:05:00Z' },
      ],
    };
    render(<AdminSupportThreadPage params={mockParams} />);
    expect(screen.getByText('Вопрос от юзера')).toBeInTheDocument();
    expect(screen.getByText('Ответ поддержки')).toBeInTheDocument();
    expect(screen.getByText('Вы (поддержка)')).toBeInTheDocument();
    expect(screen.getAllByText('Иван').length).toBeGreaterThanOrEqual(1);
  });

  it('send button is disabled when textarea is empty', () => {
    render(<AdminSupportThreadPage params={mockParams} />);
    expect(screen.getByText('Отправить')).toBeDisabled();
  });

  it('send button becomes enabled when text is entered', () => {
    render(<AdminSupportThreadPage params={mockParams} />);
    const textarea = screen.getByPlaceholderText(/Ответить пользователю/);
    fireEvent.change(textarea, { target: { value: 'Мой ответ' } });
    expect(screen.getByText('Отправить')).not.toBeDisabled();
  });
});
