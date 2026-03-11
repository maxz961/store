import { render, screen, fireEvent } from '@testing-library/react';


window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('lucide-react', () => ({
  MessageCircle: (props: any) => <div data-testid="icon-message" {...props} />,
}));
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));
jest.mock('@/components/ui/Breadcrumbs', () => ({
  Breadcrumbs: ({ items }: any) => (
    <nav>{items.map((i: any) => <span key={i.label}>{i.label}</span>)}</nav>
  ),
}));

let mockAuthState: any;
let mockMessages: any[];
let mockSendMutate: jest.Mock;

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

jest.mock('@/lib/hooks/useSupport', () => ({
  useMyMessages: () => ({ data: mockMessages, isLoading: false }),
  useSendMessage: () => ({ mutate: mockSendMutate, isPending: false }),
}));

jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

import SupportPage from './page';


describe('SupportPage', () => {
  beforeEach(() => {
    mockMessages = [];
    mockSendMutate = jest.fn();
    mockAuthState = { isAuthenticated: true, isLoading: false };
  });

  it('renders without crashing', () => {
    render(<SupportPage />);
    expect(screen.getByRole('heading', { name: 'Колл-центр' })).toBeInTheDocument();
  });

  it('renders page subtitle', () => {
    render(<SupportPage />);
    expect(screen.getByText(/Напишите нам/)).toBeInTheDocument();
  });

  it('shows empty state when no messages', () => {
    render(<SupportPage />);
    expect(screen.getByText('Нет сообщений')).toBeInTheDocument();
  });

  it('renders messages from user and admin', () => {
    mockMessages = [
      { id: '1', content: 'Привет, помогите', fromAdmin: false, readAt: null, createdAt: '2026-01-01T10:00:00Z' },
      { id: '2', content: 'Конечно, помогем!', fromAdmin: true, readAt: null, createdAt: '2026-01-01T10:05:00Z' },
    ];
    render(<SupportPage />);
    expect(screen.getByText('Привет, помогите')).toBeInTheDocument();
    expect(screen.getByText('Конечно, помогем!')).toBeInTheDocument();
    expect(screen.getByText('Поддержка')).toBeInTheDocument();
  });

  it('shows not authenticated state', () => {
    mockAuthState = { isAuthenticated: false, isLoading: false };
    render(<SupportPage />);
    expect(screen.getByText('Вы не авторизованы')).toBeInTheDocument();
    expect(screen.getByText('Войдите, чтобы написать в поддержку')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('shows spinner when auth is loading', () => {
    mockAuthState = { isAuthenticated: false, isLoading: true };
    render(<SupportPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders send button', () => {
    render(<SupportPage />);
    expect(screen.getByText('Отправить')).toBeInTheDocument();
  });

  it('send button is disabled when textarea is empty', () => {
    render(<SupportPage />);
    const button = screen.getByText('Отправить');
    expect(button).toBeDisabled();
  });

  it('send button becomes enabled when text is entered', () => {
    render(<SupportPage />);
    const textarea = screen.getByPlaceholderText(/Напишите сообщение/);
    fireEvent.change(textarea, { target: { value: 'Мой вопрос' } });
    expect(screen.getByText('Отправить')).not.toBeDisabled();
  });
});
