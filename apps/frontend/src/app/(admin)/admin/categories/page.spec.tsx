import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  Pencil: (props: any) => <div data-testid="icon-pencil" {...props} />,
  Trash2: (props: any) => <div data-testid="icon-trash" {...props} />,
  AlertTriangle: (props: any) => <div data-testid="icon-alert" {...props} />,
  Info: (props: any) => <div data-testid="icon-info" {...props} />,
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

  it('clicking delete opens confirm modal with category name', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Электроника');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Удалить категорию?')).toBeInTheDocument();
    expect(within(dialog).getByText(/Электроника/)).toBeInTheDocument();
  });

  it('confirming delete calls delete API', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Электроника');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);
    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledWith('/categories/cat-1');
    });
  });

  it('cancelling delete modal closes without deleting', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Электроника');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);
    await user.click(screen.getByRole('button', { name: 'Отмена' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockApiDelete).not.toHaveBeenCalled();
  });

  it('shows edit warning when editing category with products', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Электроника');

    const pencilButtons = screen.getAllByTestId('icon-pencil');
    await user.click(pencilButtons[0].closest('button')!);

    expect(screen.getByText(/Изменения применятся ко всем/)).toBeInTheDocument();
    expect(screen.getByText(/5 товарам в этой категории/)).toBeInTheDocument();
  });
});
