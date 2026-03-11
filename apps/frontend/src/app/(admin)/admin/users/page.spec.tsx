import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  Users: (props: any) => <div data-testid="icon-users" {...props} />,
}));

jest.mock('next/image', () => {
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  const MockImage = (props: any) => <img {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

jest.mock('@/components/ui/Spinner', () => {
  const MockSpinner = () => <div data-testid="spinner">Loading...</div>;
  MockSpinner.displayName = 'MockSpinner';
  return { Spinner: MockSpinner };
});

let mockApiGet: jest.Mock;
let mockApiPatch: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    patch: (...args: any[]) => mockApiPatch(...args),
  },
}));

import AdminUsersPage from './page';


const mockUsers = [
  {
    id: 'u1',
    email: 'admin@test.com',
    name: 'Admin User',
    image: 'https://example.com/avatar.jpg',
    role: 'ADMIN' as const,
    isBanned: false,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'u2',
    email: 'customer@test.com',
    name: 'Customer User',
    image: null,
    role: 'CUSTOMER' as const,
    isBanned: false,
    createdAt: '2026-02-20T00:00:00.000Z',
  },
  {
    id: 'u3',
    email: 'banned@test.com',
    name: null,
    image: null,
    role: 'CUSTOMER' as const,
    isBanned: true,
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

const renderPage = () => render(<AdminUsersPage />, { wrapper: createWrapper() });


describe('AdminUsersPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockUsers);
    mockApiPatch = jest.fn().mockResolvedValue(mockUsers[1]);
  });

  it('renders loading spinner initially', () => {
    mockApiGet = jest.fn().mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders title after data loads', async () => {
    renderPage();
    expect(
      await screen.findByRole('heading', { name: 'Пользователи' }),
    ).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    renderPage();
    expect(await screen.findByText('Админ-панель')).toBeInTheDocument();
  });

  it('renders user names', async () => {
    renderPage();
    expect(await screen.findByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Customer User')).toBeInTheDocument();
  });

  it('renders user emails', async () => {
    renderPage();
    expect(await screen.findByText('admin@test.com')).toBeInTheDocument();
    expect(screen.getByText('customer@test.com')).toBeInTheDocument();
  });

  it('renders role badges', async () => {
    renderPage();
    expect(await screen.findByText('Админ')).toBeInTheDocument();
    expect(screen.getAllByText('Покупатель')).toHaveLength(2);
  });

  it('renders banned status badge', async () => {
    renderPage();
    expect(await screen.findByText('Заблокирован')).toBeInTheDocument();
    expect(screen.getAllByText('Активен')).toHaveLength(2);
  });

  it('renders role toggle buttons', async () => {
    renderPage();
    expect(await screen.findByText('Снять админа')).toBeInTheDocument();
    expect(screen.getAllByText('Сделать админом')).toHaveLength(2);
  });

  it('renders ban/unban buttons for non-admin users', async () => {
    renderPage();
    expect(await screen.findByText('Заблокировать')).toBeInTheDocument();
    expect(screen.getByText('Разблокировать')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    mockApiGet = jest.fn().mockRejectedValue(new Error('Network error'));
    renderPage();
    expect(
      await screen.findByText('Не удалось загрузить пользователей'),
    ).toBeInTheDocument();
  });

  it('shows empty message when no users', async () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    renderPage();
    expect(
      await screen.findByText('Пользователи не найдены'),
    ).toBeInTheDocument();
  });

  it('calls patch on role toggle click', async () => {
    mockApiPatch = jest.fn().mockResolvedValue({ ...mockUsers[1], role: 'ADMIN' });
    renderPage();

    const buttons = await screen.findAllByText('Сделать админом');
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(mockApiPatch).toHaveBeenCalledWith('/users/u2/role', { role: 'ADMIN' });
    });
  });

  it('calls patch on ban toggle click', async () => {
    mockApiPatch = jest.fn().mockResolvedValue({ ...mockUsers[1], isBanned: true });
    renderPage();

    const banBtn = await screen.findByText('Заблокировать');
    fireEvent.click(banBtn);

    await waitFor(() => {
      expect(mockApiPatch).toHaveBeenCalledWith('/users/u2/ban', { isBanned: true });
    });
  });

  it('renders dash for user with no name', async () => {
    renderPage();
    expect(await screen.findByText('—')).toBeInTheDocument();
  });
});
