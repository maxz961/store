import { render, screen } from '@testing-library/react';


jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/admin/dashboard'),
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
}));

let mockUnreadCount: number;

jest.mock('@/lib/hooks/useSupport', () => ({
  useAdminUnreadCount: () => ({ data: mockUnreadCount }),
}));

import { AdminSidebar } from './AdminSidebar';


describe('AdminSidebar', () => {
  beforeEach(() => {
    mockUnreadCount = 0;
  });

  it('renders all nav items', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('Аналитика')).toBeInTheDocument();
    expect(screen.getByText('Товары')).toBeInTheDocument();
    expect(screen.getByText('Категории')).toBeInTheDocument();
    expect(screen.getByText('Поддержка')).toBeInTheDocument();
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
});
