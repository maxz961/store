import { render, screen } from '@testing-library/react';


jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/admin/dashboard'),
  useRouter: () => ({ prefetch: jest.fn(), push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className }: any) => <a href={href} className={className}>{children}</a>,
}));

jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <div />,
  Package: () => <div />,
  FolderTree: () => <div />,
  Tags: () => <div />,
  ShoppingCart: () => <div />,
  Megaphone: () => <div />,
  Users: () => <div />,
  MessageSquare: () => <div />,
  Headset: () => <div />,
  AlertTriangle: (props: any) => <div data-testid="icon-alert" {...props} />,
}));

let mockUnreadCount: number;
let mockImageErrorCount: number;
let mockLogsUnread: number;

jest.mock('@/lib/hooks/useSupport', () => ({
  useAdminUnreadCount: () => ({ data: mockUnreadCount }),
}));

jest.mock('@/lib/hooks/useAdmin', () => ({
  useImageErrorCount: () => ({ data: { count: mockImageErrorCount } }),
}));

jest.mock('@/lib/hooks/useLogs', () => ({
  useUnreadLogsCount: () => ({ data: mockLogsUnread }),
}));

import { AdminSidebar } from './AdminSidebar';


describe('AdminSidebar', () => {
  beforeEach(() => {
    mockUnreadCount = 0;
    mockImageErrorCount = 0;
    mockLogsUnread = 0;
  });

  it('renders all nav items', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('Аналитика')).toBeInTheDocument();
    expect(screen.getByText('Товары')).toBeInTheDocument();
    expect(screen.getByText('Категории')).toBeInTheDocument();
    expect(screen.getByText('Поддержка')).toBeInTheDocument();
    expect(screen.getByText('Логи')).toBeInTheDocument();
  });

  it('shows unread badge on Поддержка when count > 0', () => {
    mockUnreadCount = 5;
    render(<AdminSidebar />);
    expect(screen.getByTestId('support-unread-badge')).toBeInTheDocument();
    expect(screen.getByTestId('support-unread-badge')).toHaveTextContent('5');
  });

  it('hides unread badge when count is 0', () => {
    mockUnreadCount = 0;
    render(<AdminSidebar />);
    expect(screen.queryByTestId('support-unread-badge')).not.toBeInTheDocument();
  });

  it('shows active style for current route', () => {
    render(<AdminSidebar />);
    const dashboardLink = screen.getByText('Аналитика').closest('a');
    expect(dashboardLink?.className).toContain('text-primary');
  });

  it('shows badge with large counts', () => {
    mockUnreadCount = 99;
    render(<AdminSidebar />);
    expect(screen.getByTestId('support-unread-badge')).toHaveTextContent('99');
  });

  it('shows image-error icon next to Товары when image errors exist', () => {
    mockImageErrorCount = 3;
    render(<AdminSidebar />);
    expect(screen.getByTestId('products-image-error-icon')).toBeInTheDocument();
  });

  it('hides image-error icon when no image errors', () => {
    mockImageErrorCount = 0;
    render(<AdminSidebar />);
    expect(screen.queryByTestId('products-image-error-icon')).not.toBeInTheDocument();
  });

  it('shows unread badge on Логи when logsUnread > 0', () => {
    mockLogsUnread = 3;
    render(<AdminSidebar />);
    expect(screen.getByTestId('logs-unread-badge')).toBeInTheDocument();
    expect(screen.getByTestId('logs-unread-badge')).toHaveTextContent('3');
  });

  it('hides logs badge when logsUnread is 0', () => {
    mockLogsUnread = 0;
    render(<AdminSidebar />);
    expect(screen.queryByTestId('logs-unread-badge')).not.toBeInTheDocument();
  });

  it('hides logs badge when logsUnread is undefined', () => {
    mockLogsUnread = undefined as unknown as number;
    render(<AdminSidebar />);
    expect(screen.queryByTestId('logs-unread-badge')).not.toBeInTheDocument();
  });
});
