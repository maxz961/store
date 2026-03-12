import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  Heart: (props: any) => <div data-testid="icon-heart" {...props} />,
  UserCircle: (props: any) => <div data-testid="icon-user" {...props} />,
  ImageOff: (props: any) => <div data-testid="icon-image-off" {...props} />,
  Trash2: (props: any) => <div data-testid="icon-trash" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

let mockApiGet: jest.Mock;
let mockApiDelete: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    delete: (...args: any[]) => mockApiDelete(...args),
  },
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { id: 'user-1', name: 'Test', email: 'test@test.com' },
  }),
}));

jest.mock('@/components/ui/Breadcrumbs', () => ({
  Breadcrumbs: () => <nav data-testid="breadcrumbs" />,
}));

import FavoritesPage from './page';


const mockFavorites = [
  {
    id: 'fav-1',
    productId: 'prod-1',
    createdAt: new Date().toISOString(),
    product: {
      id: 'prod-1',
      name: 'Смартфон Samsung',
      slug: 'samsung-phone',
      price: '25000.00',
      comparePrice: null,
      images: [],
      stock: 5,
      isPublished: true,
      category: { name: 'Электроника' },
    },
  },
  {
    id: 'fav-2',
    productId: 'prod-2',
    createdAt: new Date().toISOString(),
    product: {
      id: 'prod-2',
      name: 'Ноутбук Lenovo',
      slug: 'lenovo-laptop',
      price: '55000.00',
      comparePrice: null,
      images: [],
      stock: 2,
      isPublished: true,
      category: { name: 'Электроника' },
    },
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

const renderPage = () => render(<FavoritesPage />, { wrapper: createWrapper() });

describe('FavoritesPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockFavorites);
    mockApiDelete = jest.fn().mockResolvedValue(undefined);
  });

  it('renders page title', () => {
    renderPage();
    expect(screen.getByText('Избранное')).toBeInTheDocument();
  });

  it('shows skeleton while loading', () => {
    mockApiGet = jest.fn(() => new Promise(() => {}));
    renderPage();
    // skeleton divs are rendered (no content yet)
    expect(screen.queryByText('Смартфон Samsung')).not.toBeInTheDocument();
  });

  it('loads and displays favorite items', async () => {
    renderPage();
    expect(await screen.findByText('Смартфон Samsung')).toBeInTheDocument();
    expect(screen.getByText('Ноутбук Lenovo')).toBeInTheDocument();
  });

  it('shows product prices', async () => {
    renderPage();
    await screen.findByText('Смартфон Samsung');
    expect(screen.getByText(/25\s*000/)).toBeInTheDocument();
  });

  it('shows empty state when no favorites', async () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('Избранное пусто')).toBeInTheDocument();
    expect(screen.getByText('Перейти в каталог')).toBeInTheDocument();
  });

  it('product name links to product page', async () => {
    renderPage();
    await screen.findByText('Смартфон Samsung');
    const links = screen.getAllByRole('link', { name: /Смартфон Samsung/i });
    expect(links[0]).toHaveAttribute('href', '/products/samsung-phone');
  });

  it('clicking trash calls delete API', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Смартфон Samsung');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);

    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledWith('/favorites/prod-1');
    });
  });
});
