import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'favorites.title': 'Favorites',
        'favorites.empty': 'No favorites yet',
        'favorites.emptyText': 'Add products to favorites by clicking the heart icon',
        'favorites.browseCatalog': 'Go to catalog',
        'favorites.notAuth': 'You are not signed in',
        'favorites.notAuthText': 'Sign in to view your favorites',
        'favorites.login': 'Sign in',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: jest.fn(), push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('lucide-react', () => ({
  Heart: (props: any) => <div data-testid="icon-heart" {...props} />,
  UserCircle: (props: any) => <div data-testid="icon-user" {...props} />,
  ImageOff: (props: any) => <div data-testid="icon-image-off" {...props} />,
  Trash2: (props: any) => <div data-testid="icon-trash" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

jest.mock('next/image', () => {
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  const MockImage = (props: any) => <img {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

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
      name: 'Samsung Smartphone',
      slug: 'samsung-phone',
      price: '25000.00',
      comparePrice: null,
      images: [],
      stock: 5,
      isPublished: true,
      category: { name: 'Electronics' },
    },
  },
  {
    id: 'fav-2',
    productId: 'prod-2',
    createdAt: new Date().toISOString(),
    product: {
      id: 'prod-2',
      name: 'Lenovo Laptop',
      slug: 'lenovo-laptop',
      price: '55000.00',
      comparePrice: null,
      images: [],
      stock: 2,
      isPublished: true,
      category: { name: 'Electronics' },
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

  it('renders page with breadcrumbs', () => {
    renderPage();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('shows skeleton while loading', () => {
    mockApiGet = jest.fn(() => new Promise(() => {}));
    renderPage();
    // skeleton divs are rendered (no content yet)
    expect(screen.queryByText('Samsung Smartphone')).not.toBeInTheDocument();
  });

  it('loads and displays favorite items', async () => {
    renderPage();
    expect(await screen.findByText('Samsung Smartphone')).toBeInTheDocument();
    expect(screen.getByText('Lenovo Laptop')).toBeInTheDocument();
  });

  it('shows product prices', async () => {
    renderPage();
    await screen.findByText('Samsung Smartphone');
    expect(screen.getByText(/25\s*000/)).toBeInTheDocument();
  });

  it('shows empty state when no favorites', async () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('No favorites yet')).toBeInTheDocument();
    expect(screen.getByText('Go to catalog')).toBeInTheDocument();
  });

  it('product name links to product page', async () => {
    renderPage();
    await screen.findByText('Samsung Smartphone');
    const links = screen.getAllByRole('link', { name: /Samsung Smartphone/i });
    expect(links[0]).toHaveAttribute('href', '/products/samsung-phone');
  });

  it('clicking trash calls delete API', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Samsung Smartphone');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);

    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledWith('/favorites/prod-1');
    });
  });
});
