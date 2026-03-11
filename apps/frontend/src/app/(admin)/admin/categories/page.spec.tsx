import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  Pencil: (props: any) => <div data-testid="icon-pencil" {...props} />,
  Trash2: (props: any) => <div data-testid="icon-trash" {...props} />,
}));

let mockApiGet: jest.Mock;
let mockApiPost: jest.Mock;
let mockApiPut: jest.Mock;
let mockApiDelete: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    post: (...args: any[]) => mockApiPost(...args),
    put: (...args: any[]) => mockApiPut(...args),
    delete: (...args: any[]) => mockApiDelete(...args),
  },
}));

import CategoriesPage from './page';


const mockCategories = [
  { id: 'cat-1', name: 'Электроника', slug: 'electronics', _count: { products: 5 } },
  { id: 'cat-2', name: 'Одежда', slug: 'clothes', _count: { products: 3 } },
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

const renderPage = () => render(<CategoriesPage />, { wrapper: createWrapper() });

describe('CategoriesPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockCategories);
    mockApiPost = jest.fn().mockResolvedValue({ id: 'new-cat', name: 'Test', slug: 'test' });
    mockApiPut = jest.fn().mockResolvedValue({});
    mockApiDelete = jest.fn().mockResolvedValue(undefined);
  });

  it('renders page title', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Категории' })).toBeInTheDocument();
  });

  it('renders form for creating category', () => {
    renderPage();
    expect(screen.getByText('Новая категория')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Электроника')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('electronics')).toBeInTheDocument();
  });

  it('loads and displays categories', async () => {
    renderPage();
    expect(await screen.findByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('Одежда')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows empty state when no categories', async () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('Категорий пока нет')).toBeInTheDocument();
  });

  it('submits create form', async () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText('Электроника'), { target: { value: 'Книги' } });
    fireEvent.change(screen.getByPlaceholderText('electronics'), { target: { value: 'books' } });
    fireEvent.submit(screen.getByText('Создать').closest('form')!);

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith(
        '/categories',
        expect.objectContaining({ name: 'Книги', slug: 'books' }),
      );
    });
  });

  it('renders edit and delete buttons', async () => {
    renderPage();
    await screen.findByText('Электроника');
    expect(screen.getAllByTestId('icon-pencil')).toHaveLength(2);
    expect(screen.getAllByTestId('icon-trash')).toHaveLength(2);
  });
});
