import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  ChevronDown: (props: any) => <div data-testid="icon-chevron-down" {...props} />,
  Eye: (props: any) => <div data-testid="icon-eye" {...props} />,
  X: (props: any) => <div data-testid="icon-x" {...props} />,
  ImagePlus: (props: any) => <div data-testid="icon-image-plus" {...props} />,
  Info: (props: any) => <div data-testid="icon-info" {...props} />,
  HelpCircle: (props: any) => <div data-testid="icon-help" {...props} />,
}));

jest.mock('next/image', () => {
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  const MockImage = (props: any) => <img {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/hooks/useAdmin', () => ({
  useUploadProductImages: () => ({
    mutateAsync: jest.fn().mockResolvedValue({ urls: ['https://example.com/uploaded.jpg'] }),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

let mockApiGet: jest.Mock;
let mockApiPost: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    post: (...args: any[]) => mockApiPost(...args),
  },
}));

import NewPromotionPage from './page';


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

const renderPage = () => render(<NewPromotionPage />, { wrapper: createWrapper() });

const mockProducts = {
  items: [
    {
      id: 'p1',
      name: 'Товар 1',
      slug: 'tovar-1',
      price: 100,
      images: [],
      stock: 10,
      category: { name: 'Электроника', slug: 'electronics' },
      tags: [],
      reviews: [],
    },
  ],
  total: 1,
  page: 1,
  totalPages: 1,
};


describe('NewPromotionPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path.startsWith('/products')) return Promise.resolve(mockProducts);
      return Promise.resolve([]);
    });
    mockApiPost = jest.fn().mockResolvedValue({ id: 'new-promo' });
  });

  it('renders all form sections', () => {
    renderPage();
    expect(screen.getByText('Основная информация')).toBeInTheDocument();
    expect(screen.getByText('Расписание')).toBeInTheDocument();
    expect(screen.getByText('Скидка')).toBeInTheDocument();
    expect(screen.getByText('Баннер')).toBeInTheDocument();
    expect(screen.getByText('Товары в акции')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Акции')).toBeInTheDocument();
    expect(screen.getByText('Админ-панель')).toBeInTheDocument();
  });

  it('auto-generates slug from title', () => {
    renderPage();
    const titleInput = screen.getByPlaceholderText('Например: Весенняя распродажа');
    fireEvent.change(titleInput, { target: { value: 'Spring Sale' } });
    const slugInput = screen.getByDisplayValue('spring-sale');
    expect(slugInput).toBeInTheDocument();
  });

  it('toggles product selection', async () => {
    renderPage();
    const productBtn = await screen.findByText('Товар 1');
    fireEvent.click(productBtn);
    expect(productBtn).toHaveClass('bg-primary');
    fireEvent.click(productBtn);
    expect(productBtn).not.toHaveClass('bg-primary');
  });

  it('renders submit button "Создать акцию"', () => {
    renderPage();
    expect(screen.getByText('Создать акцию')).toBeInTheDocument();
  });

  it('submits form and redirects', async () => {
    const { container } = renderPage();

    fireEvent.change(screen.getByPlaceholderText('Например: Весенняя распродажа'), { target: { value: 'Spring Sale' } });

    // Switch banner section to URL mode so the URL input is visible
    fireEvent.click(screen.getByText('По ссылке'));
    fireEvent.change(screen.getByPlaceholderText('https://images.unsplash.com/...'), { target: { value: 'https://img.jpg' } });

    const startDateInput = container.querySelector('input[name="startDate"]')!;
    const endDateInput = container.querySelector('input[name="endDate"]')!;
    fireEvent.change(startDateInput, { target: { value: '2026-04-01T00:00' } });
    fireEvent.change(endDateInput, { target: { value: '2026-04-30T23:59' } });

    fireEvent.change(screen.getByPlaceholderText('25'), { target: { value: '15' } });

    fireEvent.submit(screen.getByText('Создать акцию').closest('form')!);

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/promotions', expect.objectContaining({
        title: 'Spring Sale',
        slug: 'spring-sale',
        bannerImageUrl: 'https://img.jpg',
        discountType: 'PERCENTAGE',
        discountValue: 15,
      }));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/promotions');
    });
  });

  it('shows error on submit failure', async () => {
    mockApiPost = jest.fn().mockRejectedValue(new Error('Ошибка создания'));
    const { container } = renderPage();

    fireEvent.change(screen.getByPlaceholderText('Например: Весенняя распродажа'), { target: { value: 'Test' } });

    // Switch banner section to URL mode so the URL input is visible
    fireEvent.click(screen.getByText('По ссылке'));
    fireEvent.change(screen.getByPlaceholderText('https://images.unsplash.com/...'), { target: { value: 'https://img.jpg' } });

    const startDateInput = container.querySelector('input[name="startDate"]')!;
    const endDateInput = container.querySelector('input[name="endDate"]')!;
    fireEvent.change(startDateInput, { target: { value: '2026-04-01T00:00' } });
    fireEvent.change(endDateInput, { target: { value: '2026-04-30T23:59' } });

    fireEvent.change(screen.getByPlaceholderText('25'), { target: { value: '15' } });

    fireEvent.submit(screen.getByText('Создать акцию').closest('form')!);

    expect(await screen.findByText('Ошибка создания')).toBeInTheDocument();
  });
});
