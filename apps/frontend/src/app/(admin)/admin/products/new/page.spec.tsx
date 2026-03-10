import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

let mockApiGet: jest.Mock;
let mockApiPost: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    post: (...args: any[]) => mockApiPost(...args),
  },
}));

import NewProductPage from './page';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderPage = () => render(<NewProductPage />, { wrapper: createWrapper() });

const mockCategories = [
  { id: 'cat-1', name: 'Электроника' },
  { id: 'cat-2', name: 'Одежда' },
];

const mockTags = [
  { id: 'tag-1', name: 'Новинка' },
  { id: 'tag-2', name: 'Скидка' },
];


describe('NewProductPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockApiGet = jest.fn().mockImplementation((path: string) => {
      if (path === '/categories') return Promise.resolve(mockCategories);
      if (path === '/tags') return Promise.resolve(mockTags);
      return Promise.resolve([]);
    });
    mockApiPost = jest.fn().mockResolvedValue({ id: 'new-prod' });
  });

  it('renders title', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Новый товар' })).toBeInTheDocument();
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

  it('submits form and redirects', async () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText('Например: Беспроводные наушники'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Подробное описание товара...'), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });

    await screen.findByText('Электроника');
    fireEvent.change(screen.getByDisplayValue('Выберите категорию'), { target: { value: 'cat-1' } });
    fireEvent.change(screen.getByPlaceholderText(/example.com/), { target: { value: 'https://img.jpg' } });

    fireEvent.submit(screen.getByText('Создать товар').closest('form')!);

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/products', expect.objectContaining({ name: 'Test' }));
    });
  });

  it('shows error on submit failure', async () => {
    mockApiPost = jest.fn().mockRejectedValue(new Error('Ошибка валидации'));
    renderPage();

    // Fill all required fields to pass Zod validation
    fireEvent.change(screen.getByPlaceholderText('Например: Беспроводные наушники'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Подробное описание товара...'), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });

    await screen.findByText('Электроника');
    fireEvent.change(screen.getByDisplayValue('Выберите категорию'), { target: { value: 'cat-1' } });
    fireEvent.change(screen.getByPlaceholderText(/example.com/), { target: { value: 'https://img.jpg' } });

    fireEvent.submit(screen.getByText('Создать товар').closest('form')!);

    expect(await screen.findByText('Ошибка валидации')).toBeInTheDocument();
  });

  it('renders publish checkbox', () => {
    renderPage();
    expect(screen.getByText('Опубликовать сразу')).toBeInTheDocument();
  });
});
