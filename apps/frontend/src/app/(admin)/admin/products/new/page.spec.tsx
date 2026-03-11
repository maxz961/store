import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


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
  { id: 'cat-1', name: 'Электроника', slug: 'electronics' },
  { id: 'cat-2', name: 'Одежда', slug: 'clothes' },
];

const mockTags = [
  { id: 'tag-1', name: 'Новинка' },
  { id: 'tag-2', name: 'Скидка' },
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
    expect(screen.getByText('Основная информация')).toBeInTheDocument();
    expect(screen.getByText('Цена и склад')).toBeInTheDocument();
    expect(screen.getByText('Изображения')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Товары')).toBeInTheDocument();
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
    expect(screen.getByText('Нет в наличии')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('icon-x'));
    expect(screen.queryByText('Нет в наличии')).not.toBeInTheDocument();
  });

  it('loads categories', async () => {
    renderPage();
    expect(await screen.findByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('Одежда')).toBeInTheDocument();
  });

  it('loads tags', async () => {
    renderPage();
    expect(await screen.findByText('Новинка')).toBeInTheDocument();
    expect(screen.getByText('Скидка')).toBeInTheDocument();
  });

  it('auto-generates slug from name', () => {
    renderPage();
    const nameInput = screen.getByPlaceholderText('Например: Беспроводные наушники');
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    const slugInput = screen.getByDisplayValue('test-product');
    expect(slugInput).toBeInTheDocument();
  });

  it('toggles tag selection', async () => {
    renderPage();
    const tagBtn = await screen.findByText('Новинка');
    fireEvent.click(tagBtn);
    expect(tagBtn).toHaveClass('bg-primary');
    fireEvent.click(tagBtn);
    expect(tagBtn).not.toHaveClass('bg-primary');
  });

  it('submits form with url images and redirects', async () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText('Например: Беспроводные наушники'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Подробное описание товара...'), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });

    await screen.findByText('Электроника');
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

    fireEvent.change(screen.getByPlaceholderText('Например: Беспроводные наушники'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Подробное описание товара...'), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });

    await screen.findByText('Электроника');
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
