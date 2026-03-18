import { render, screen, fireEvent } from '@testing-library/react';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'support.subtitle': 'Write to us — we will respond as soon as possible',
        'support.noMessages': 'No messages yet',
        'support.noMessagesText': 'Start a conversation with our support team',
        'support.notAuth': 'Sign in to contact support',
        'support.notAuthText': 'Please log in to send messages',
        'support.login': 'Log in',
        'support.send': 'Send',
        'support.sending': 'Sending...',
        'support.placeholder': 'Write a message...',
        'support.adminLabel': 'Support',
      };
      return map[key] ?? key;
    },
  }),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }) }));
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
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders page subtitle', () => {
    render(<SupportPage />);
    expect(screen.getByText(/Write to us/)).toBeInTheDocument();
  });

  it('shows empty state when no messages', () => {
    render(<SupportPage />);
    expect(screen.getByText('No messages yet')).toBeInTheDocument();
  });

  it('renders messages from user and admin', () => {
    mockMessages = [
      { id: '1', content: 'Привет, помогите', fromAdmin: false, readAt: null, createdAt: '2026-01-01T10:00:00Z' },
      { id: '2', content: 'Конечно, помогем!', fromAdmin: true, readAt: null, createdAt: '2026-01-01T10:05:00Z' },
    ];
    render(<SupportPage />);
    expect(screen.getByText('Привет, помогите')).toBeInTheDocument();
    expect(screen.getByText('Конечно, помогем!')).toBeInTheDocument();
    expect(screen.getAllByText('Support').length).toBeGreaterThanOrEqual(1);
  });

  it('shows not authenticated state', () => {
    mockAuthState = { isAuthenticated: false, isLoading: false };
    render(<SupportPage />);
    expect(screen.getByText('Sign in to contact support')).toBeInTheDocument();
    expect(screen.getByText('Please log in to send messages')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('shows spinner when auth is loading', () => {
    mockAuthState = { isAuthenticated: false, isLoading: true };
    render(<SupportPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders send button', () => {
    render(<SupportPage />);
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('send button is disabled when textarea is empty', () => {
    render(<SupportPage />);
    const button = screen.getByText('Send');
    expect(button).toBeDisabled();
  });

  it('send button becomes enabled when text is entered', () => {
    render(<SupportPage />);
    const textarea = screen.getByPlaceholderText(/Write a message/);
    fireEvent.change(textarea, { target: { value: 'Мой вопрос' } });
    expect(screen.getByText('Send')).not.toBeDisabled();
  });
});
