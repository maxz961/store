import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  ChevronDown: (props: any) => <div data-testid="icon-chevron-down" {...props} />,
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

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'promo-1' }),
  useRouter: () => ({ push: mockPush }),
}));

let mockApiGet: jest.Mock;
let mockApiPut: jest.Mock;
let mockApiDelete: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    put: (...args: any[]) => mockApiPut(...args),
    delete: (...args: any[]) => mockApiDelete(...args),
  },
}));

import EditPromotionPage from './page';


const mockPromotion = {
  id: 'promo-1',
  title: 'Весенняя распродажа',
  slug: 'spring-sale',
  description: 'Скидки на все',
  bannerImageUrl: 'https://example.com/banner.jpg',
  bannerBgColor: '#e8f5e9',
  startDate: '2026-03-01T00:00:00.000Z',
  endDate: '2026-04-01T00:00:00.000Z',
  discountType: 'PERCENTAGE',
  discountValue: 25,
  isActive: true,
  position: 0,
  link: '/products?tagSlugs=sale',
  createdAt: '2026-02-01T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
  products: [
    {
      productId: 'p1',
      product: { id: 'p1', name: 'Товар 1', slug: 't1', images: [], price: 100 },
    },
  ],
};

const mockProducts = {
  items: [
    { id: 'p1', name: 'Товар 1', slug: 't1', images: [], price: 100, stock: 10, category: { name: 'Cat', slug: 'cat' }, tags: [], reviews: [] },
    { id: 'p2', name: 'Товар 2', slug: 't2', images: [], price: 200, stock: 5, category: { name: 'Cat', slug: 'cat' }, tags: [], reviews: [] },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
};

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

const renderPage = () =>
  render(<EditPromotionPage />, { wrapper: createWrapper() });


describe('EditPromotionPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path === '/promotions/promo-1') return Promise.resolve(mockPromotion);
      if (path.startsWith('/products')) return Promise.resolve(mockProducts);
      return Promise.resolve(null);
    });
    mockApiPut = jest.fn().mockResolvedValue(mockPromotion);
    mockApiDelete = jest.fn().mockResolvedValue(undefined);
  });

  it('renders loading spinner initially', () => {
    mockApiGet = jest.fn().mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders save button after data loads', async () => {
    renderPage();
    expect(await screen.findByText('Сохранить изменения')).toBeInTheDocument();
  });

  it('renders all form sections', async () => {
    renderPage();
    expect(await screen.findByText('Основная информация')).toBeInTheDocument();
    expect(screen.getByText('Расписание')).toBeInTheDocument();
    expect(screen.getByText('Скидка')).toBeInTheDocument();
    expect(screen.getByText('Баннер')).toBeInTheDocument();
    expect(screen.getByText('Товары в акции')).toBeInTheDocument();
  });

  it('renders breadcrumbs with promotion title', async () => {
    renderPage();
    expect(await screen.findByText('Акции')).toBeInTheDocument();
    expect(screen.getByText('Весенняя распродажа')).toBeInTheDocument();
  });

  it('prefills form fields with promotion data', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Весенняя распродажа')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('spring-sale')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Скидки на все')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/banner.jpg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#e8f5e9')).toBeInTheDocument();
    expect(screen.getByDisplayValue('/products?tagSlugs=sale')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  it('renders delete button', async () => {
    renderPage();
    expect(await screen.findByText('Удалить акцию')).toBeInTheDocument();
  });

  it('renders submit button', async () => {
    renderPage();
    expect(await screen.findByText('Сохранить изменения')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path === '/promotions/promo-1') return Promise.reject(new Error('Not found'));
      if (path.startsWith('/products')) return Promise.resolve(mockProducts);
      return Promise.resolve(null);
    });
    renderPage();
    expect(await screen.findByText('Не удалось загрузить акцию')).toBeInTheDocument();
  });

  it('renders danger zone section', async () => {
    renderPage();
    expect(await screen.findByText('Опасная зона')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Удаление акции необратимо. Баннер исчезнет из каталога, а привязка к товарам будет удалена.',
      ),
    ).toBeInTheDocument();
  });

  it('loads products for toggle selection', async () => {
    renderPage();
    await screen.findByText('Товары в акции');
    expect(await screen.findByText('Товар 1')).toBeInTheDocument();
    expect(screen.getByText('Товар 2')).toBeInTheDocument();
  });

  it('calls delete mutation and redirects on success', async () => {
    renderPage();
    const deleteBtn = await screen.findByText('Удалить акцию');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledWith('/promotions/promo-1');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/promotions');
    });
  });
});
