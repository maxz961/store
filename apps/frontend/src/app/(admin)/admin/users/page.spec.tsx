import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  Users: (props: any) => <div data-testid="icon-users" {...props} />,
  Search: (props: any) => <div data-testid="icon-search" {...props} />,
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

jest.mock('@/components/ui/Breadcrumbs', () => ({
  Breadcrumbs: ({ items }: any) => (
    <nav>{items.map((i: any) => <span key={i.label}>{i.label}</span>)}</nav>
  ),
}));

jest.mock('@/components/ui/SelectField', () => {
  const MockSelectField = ({ value, onChange, options, label }: any) => (
    <select aria-label={label || 'role-select'} value={value} onChange={onChange}>
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
  MockSelectField.displayName = 'MockSelectField';
  return { SelectField: MockSelectField };
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
    role: 'ADMIN',
    isBanned: false,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'u2',
    email: 'customer@test.com',
    name: 'Customer User',
    image: null,
    role: 'CUSTOMER',
    isBanned: false,
    createdAt: '2026-02-20T00:00:00.000Z',
  },
  {
    id: 'u3',
    email: 'banned@test.com',
    name: null,
    image: null,
    role: 'CUSTOMER',
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

  it('renders search input after data loads', async () => {
    renderPage();
    expect(
      await screen.findByPlaceholderText('Поиск по имени или email...'),
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

  it('renders role dropdowns with correct values', async () => {
    renderPage();
    const selects = await screen.findAllByRole('combobox');
    expect(selects).toHaveLength(3);
    expect(selects[0]).toHaveValue('ADMIN');
    expect(selects[1]).toHaveValue('CUSTOMER');
    expect(selects[2]).toHaveValue('CUSTOMER');
  });

  it('renders banned status badge', async () => {
    renderPage();
    expect(await screen.findByText('Заблокирован')).toBeInTheDocument();
    expect(screen.getAllByText('Активен')).toHaveLength(2);
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

  it('calls patch on role dropdown change', async () => {
    mockApiPatch = jest.fn().mockResolvedValue({ ...mockUsers[1], role: 'ADMIN' });
    renderPage();

    const selects = await screen.findAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'ADMIN' } });

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

  it('renders search input', async () => {
    renderPage();
    expect(
      await screen.findByPlaceholderText('Поиск по имени или email...'),
    ).toBeInTheDocument();
  });

  it('filters users by name', async () => {
    renderPage();
    const searchInput = await screen.findByPlaceholderText('Поиск по имени или email...');
    fireEvent.change(searchInput, { target: { value: 'Admin' } });
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('Customer User')).not.toBeInTheDocument();
  });

  it('filters users by email', async () => {
    renderPage();
    const searchInput = await screen.findByPlaceholderText('Поиск по имени или email...');
    fireEvent.change(searchInput, { target: { value: 'customer@' } });
    expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
    expect(screen.getByText('Customer User')).toBeInTheDocument();
  });

  it('search is case insensitive', async () => {
    renderPage();
    const searchInput = await screen.findByPlaceholderText('Поиск по имени или email...');
    fireEvent.change(searchInput, { target: { value: 'admin user' } });
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('shows empty state when search has no matches', async () => {
    renderPage();
    const searchInput = await screen.findByPlaceholderText('Поиск по имени или email...');
    fireEvent.change(searchInput, { target: { value: 'xyz-not-exists' } });
    expect(screen.getByText('Пользователи не найдены')).toBeInTheDocument();
  });

  it('shows all users when search is cleared', async () => {
    renderPage();
    const searchInput = await screen.findByPlaceholderText('Поиск по имени или email...');
    fireEvent.change(searchInput, { target: { value: 'Admin' } });
    expect(screen.queryByText('Customer User')).not.toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Customer User')).toBeInTheDocument();
  });

  // Load More pagination
  const make20Users = () =>
    Array.from({ length: 20 }, (_, i) => ({
      id: `u${i + 10}`,
      email: `user${i}@test.com`,
      name: `User ${i}`,
      image: null,
      role: 'CUSTOMER',
      isBanned: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    }));

  it('hides Load More button when fewer than 20 users', async () => {
    renderPage();
    await screen.findByText('Admin User');
    expect(screen.queryByText('Загрузить ещё')).not.toBeInTheDocument();
  });

  it('shows Load More button when exactly 20 users are loaded', async () => {
    mockApiGet = jest.fn().mockResolvedValue(make20Users());
    renderPage();
    expect(await screen.findByText('Загрузить ещё')).toBeInTheDocument();
  });

  it('clicking Load More fetches next page', async () => {
    mockApiGet = jest.fn()
      .mockResolvedValueOnce(make20Users())
      .mockResolvedValueOnce([mockUsers[0]]);
    renderPage();

    const loadMoreBtn = await screen.findByText('Загрузить ещё');
    fireEvent.click(loadMoreBtn);

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledTimes(2);
      expect(mockApiGet).toHaveBeenLastCalledWith('/users?skip=20&take=20');
    });
  });
});
