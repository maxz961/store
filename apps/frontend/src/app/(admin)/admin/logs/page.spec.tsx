import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLogsPage from './page';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ lang: 'uk', t: (k: string) => k }),
}));

jest.mock('lucide-react', () => ({
  AlertTriangle: () => <div data-testid="icon-alert" />,
}));

const mockMutate = jest.fn();

jest.mock('@/lib/hooks/useLogs', () => ({
  useLogs: jest.fn(),
  useMarkLogsRead: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
}));

jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

jest.mock('@/components/ui/Breadcrumbs', () => ({
  Breadcrumbs: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="breadcrumbs">{items.map((i) => i.label).join(' / ')}</nav>
  ),
}));

jest.mock('./LogsTable', () => ({
  LogsTable: ({ logs }: { logs: unknown[] }) => (
    <table data-testid="logs-table">
      <tbody>
        {(logs as { id: string; message: string }[]).map((l) => (
          <tr key={l.id}><td>{l.message}</td></tr>
        ))}
      </tbody>
    </table>
  ),
}));

const mockUnreadLog = {
  id: 'log-1',
  message: 'TypeError: Cannot read properties of undefined',
  stack: 'Error: ...\n  at Component',
  url: 'http://localhost:3000/admin',
  userId: 'user-1',
  isRead: false,
  createdAt: '2026-01-01T10:00:00Z',
};

const mockReadLog = {
  ...mockUnreadLog,
  id: 'log-2',
  isRead: true,
};

const { useLogs } = require('@/lib/hooks/useLogs') as { useLogs: jest.Mock };


describe('AdminLogsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders spinner while loading', () => {
    useLogs.mockReturnValue({ data: undefined, isLoading: true });

    render(<AdminLogsPage />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    useLogs.mockReturnValue({ data: [], isLoading: false });

    render(<AdminLogsPage />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('nav.admin / admin.logs.breadcrumbLabel')).toBeInTheDocument();
  });

  it('renders page title', () => {
    useLogs.mockReturnValue({ data: [], isLoading: false });

    render(<AdminLogsPage />);

    expect(screen.getByRole('heading', { name: 'admin.logs.pageTitle' })).toBeInTheDocument();
  });

  it('renders empty state when no logs', () => {
    useLogs.mockReturnValue({ data: [], isLoading: false });

    render(<AdminLogsPage />);

    expect(screen.getByText('admin.logs.emptyState')).toBeInTheDocument();
    expect(screen.queryByTestId('logs-table')).not.toBeInTheDocument();
  });

  it('renders logs table when logs exist', () => {
    useLogs.mockReturnValue({ data: [mockUnreadLog, mockReadLog], isLoading: false });

    render(<AdminLogsPage />);

    expect(screen.getByTestId('logs-table')).toBeInTheDocument();
  });

  it('shows mark-all-read button when there are unread logs', () => {
    useLogs.mockReturnValue({ data: [mockUnreadLog], isLoading: false });

    render(<AdminLogsPage />);

    expect(screen.getByRole('button', { name: 'admin.logs.markAllRead' })).toBeInTheDocument();
  });

  it('calls markRead.mutate when mark-all-read button is clicked', async () => {
    useLogs.mockReturnValue({ data: [mockUnreadLog], isLoading: false });

    render(<AdminLogsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'admin.logs.markAllRead' }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });
  });

  it('hides mark-all-read button when all logs are read', () => {
    useLogs.mockReturnValue({ data: [mockReadLog], isLoading: false });

    render(<AdminLogsPage />);

    expect(screen.queryByRole('button', { name: 'admin.logs.markAllRead' })).not.toBeInTheDocument();
  });
});
