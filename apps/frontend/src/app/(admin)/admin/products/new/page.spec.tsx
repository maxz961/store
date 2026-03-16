import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'product.addToCart': 'Add to cart',
        'product.inCart': 'In cart',
        'product.adding': 'Adding...',
        'product.outOfStock': 'Out of stock',
        'product.noPhoto': 'No photo',
        'product.inStock': 'In stock',
        'product.pieces': 'pcs.',
        'product.reviews': 'Reviews',
        'product.noReviews': 'No reviews yet',
        'product.description': 'Description',
        'product.category': 'Category',
        'product.tags': 'Tags',
        'favorites.empty': 'No favorites yet',
        'favorites.title': 'Favorites',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  ChevronDown: (props: any) => <div data-testid="icon-chevron-down" {...props} />,
  ImagePlus: (props: any) => <div data-testid="icon-image-plus" {...props} />,
  X: (props: any) => <div data-testid="icon-x" {...props} />,
  Eye: (props: any) => <div data-testid="icon-eye" {...props} />,
  ImageIcon: (props: any) => <div data-testid="icon-image" {...props} />,
  ImageOff: (props: any) => <div data-testid="icon-image-off" {...props} />,
  ShoppingCart: (props: any) => <div data-testid="icon-cart" {...props} />,
  Minus: (props: any) => <div data-testid="icon-minus" {...props} />,
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  Check: (props: any) => <div data-testid="icon-check" {...props} />,
  Star: (props: any) => <div data-testid="icon-star" {...props} />,
  Heart: (props: any) => <div data-testid="icon-heart" {...props} />,
  MessageSquare: (props: any) => <div data-testid="icon-message" {...props} />,
  HelpCircle: (props: any) => <div data-testid="icon-help" {...props} />,
  Info: (props: any) => <div data-testid="icon-info" {...props} />,
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

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: false }),
}));

jest.mock('@/lib/hooks/useFavorites', () => ({
  useFavoriteIds: () => ({ data: [] }),
  useAddFavorite: () => ({ mutate: jest.fn() }),
  useRemoveFavorite: () => ({ mutate: jest.fn() }),
}));

let mockApiGet: jest.Mock;
let mockApiPost: jest.Mock;
let mockApiUploadFiles: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    post: (...args: any[]) => mockApiPost(...args),
    uploadFiles: (...args: any[]) => mockApiUploadFiles(...args),
  },
}));

import NewProductPage from './page';


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

const renderPage = () => render(<NewProductPage />, { wrapper: createWrapper() });

const mockCategories = [
  { id: 'cat-1', name: 'Electronics', slug: 'electronics' },
  { id: 'cat-2', name: 'Clothing', slug: 'clothes' },
];

const mockTags = [
  { id: 'tag-1', name: 'New' },
  { id: 'tag-2', name: 'Sale' },
];


let blobCounter = 0;

describe('NewProductPage', () => {
  beforeEach(() => {
    blobCounter = 0;
    global.URL.createObjectURL = jest.fn(
      () => `blob:http://localhost/${++blobCounter}`,
    );
    global.URL.revokeObjectURL = jest.fn();
    mockPush.mockClear();
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path === '/categories') return Promise.resolve(mockCategories);
      if (path === '/tags') return Promise.resolve(mockTags);
      return Promise.resolve([]);
    });
    mockApiPost = jest.fn().mockResolvedValue({ id: 'new-prod' });
    mockApiUploadFiles = jest.fn().mockResolvedValue({ urls: ['https://uploaded.jpg'] });
  });

  it('renders form sections', () => {
    renderPage();
    expect(screen.getByText('Basic information')).toBeInTheDocument();
    expect(screen.getByText('Цена и склад')).toBeInTheDocument();
    expect(screen.getByText('Изображения')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Товари')).toBeInTheDocument();
  });

  it('renders image upload tabs', () => {
    renderPage();
    expect(screen.getByText('Загрузить файл')).toBeInTheDocument();
    expect(screen.getByText('По ссылке')).toBeInTheDocument();
  });

  it('switches between file and url tabs', () => {
    renderPage();
    const urlTab = screen.getByText('По ссылке');
    fireEvent.click(urlTab);
    expect(screen.getByPlaceholderText(/example.com/)).toBeInTheDocument();
  });

  it('renders preview button', () => {
    renderPage();
    expect(screen.getByText('Предпросмотр')).toBeInTheDocument();
  });

  it('opens and closes preview modal', () => {
    renderPage();
    fireEvent.click(screen.getByText('Предпросмотр'));
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
    expect(screen.getByText('0 ₴')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('icon-x'));
    expect(screen.queryByText('Out of stock')).not.toBeInTheDocument();
  });

  it('loads categories', async () => {
    renderPage();
    expect(await screen.findByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
  });

  it('loads tags', async () => {
    renderPage();
    expect(await screen.findByText('New')).toBeInTheDocument();
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('auto-generates slug from name', () => {
    renderPage();
    const nameInput = screen.getByPlaceholderText('e.g. Wireless Headphones');
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    const slugInput = screen.getByDisplayValue('test-product');
    expect(slugInput).toBeInTheDocument();
  });

  it('toggles tag selection', async () => {
    renderPage();
    const tagBtn = await screen.findByText('New');
    fireEvent.click(tagBtn);
    expect(tagBtn).toHaveClass('bg-primary');
    fireEvent.click(tagBtn);
    expect(tagBtn).not.toHaveClass('bg-primary');
  });

  it('submits form with url images and redirects', async () => {
    renderPage();

    // Fill UK tab fields
    fireEvent.change(screen.getByPlaceholderText('e.g. Wireless Headphones'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Detailed product description...'), { target: { value: 'Product test description long enough' } });

    // Switch to EN tab and fill required nameEn, descriptionEn
    fireEvent.click(screen.getByText(/🇬🇧/));
    fireEvent.change(screen.getByPlaceholderText('e.g. Wireless Headphones'), { target: { value: 'Test EN' } });
    fireEvent.change(screen.getByPlaceholderText('Detailed product description...'), { target: { value: 'Product test description EN long enough' } });

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });

    await screen.findByText('Electronics');
    fireEvent.change(screen.getByDisplayValue('Выберите категорию'), { target: { value: 'cat-1' } });

    // Switch to URL tab and enter image URL
    fireEvent.click(screen.getByText('По ссылке'));
    fireEvent.change(screen.getByPlaceholderText(/example.com/), { target: { value: 'https://img.jpg' } });

    fireEvent.submit(screen.getByText('Создать товар').closest('form')!);

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/products', expect.objectContaining({ name: 'Test' }));
    });
  });

  it('shows error on submit failure', async () => {
    mockApiPost = jest.fn().mockRejectedValue(new Error('Ошибка валидации'));
    renderPage();

    // Fill UK tab fields
    fireEvent.change(screen.getByPlaceholderText('e.g. Wireless Headphones'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Detailed product description...'), { target: { value: 'Product test description long enough' } });

    // Switch to EN tab and fill required nameEn, descriptionEn
    fireEvent.click(screen.getByText(/🇬🇧/));
    fireEvent.change(screen.getByPlaceholderText('e.g. Wireless Headphones'), { target: { value: 'Test EN' } });
    fireEvent.change(screen.getByPlaceholderText('Detailed product description...'), { target: { value: 'Product test description EN long enough' } });

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });

    await screen.findByText('Electronics');
    fireEvent.change(screen.getByDisplayValue('Выберите категорию'), { target: { value: 'cat-1' } });

    fireEvent.click(screen.getByText('По ссылке'));
    fireEvent.change(screen.getByPlaceholderText(/example.com/), { target: { value: 'https://img.jpg' } });

    fireEvent.submit(screen.getByText('Создать товар').closest('form')!);

    expect(await screen.findByText('Ошибка валидации')).toBeInTheDocument();
  });

  it('renders publish checkbox', () => {
    renderPage();
    expect(screen.getByText('Опубликовать сразу')).toBeInTheDocument();
  });

  it('displays thumbnail after file selection', () => {
    renderPage();

    const input = document.querySelector('input[type="file"]')!;
    const file = new File(['image-data'], 'photo.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    const thumbnail = document.querySelector('img[src^="blob:"]');
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', 'blob:http://localhost/1');
  });

  it('file tab is active by default', () => {
    renderPage();
    const fileTab = screen.getByText('Загрузить файл');
    expect(fileTab).toHaveClass('bg-white');
  });
});
