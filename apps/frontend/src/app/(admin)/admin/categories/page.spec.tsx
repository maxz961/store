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

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ isAdmin: true }),
}));

jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ lang: 'en', setLang: jest.fn(), t: (key: string) => key }),
}));

import CategoriesPage from './page';


const mockCategories = [
  { id: 'cat-1', name: 'Электроника', nameEn: 'Electronics', slug: 'electronics', _count: { products: 5 } },
  { id: 'cat-2', name: 'Одежда', nameEn: 'Clothing', slug: 'clothes', _count: { products: 3 } },
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
    expect(screen.getByText('New category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Electronics')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('electronics')).toBeInTheDocument();
  });

  it('loads and displays categories', async () => {
    renderPage();
    expect(await screen.findByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows empty state when no categories', async () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('No categories yet')).toBeInTheDocument();
  });

  it('submits create form', async () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText('Electronics'), { target: { value: 'Книги' } });
    fireEvent.change(screen.getByPlaceholderText('electronics'), { target: { value: 'books' } });

    // Switch to EN tab to fill required nameEn field
    fireEvent.click(screen.getByText('🇬🇧 EN'));
    await waitFor(() => {
      expect(document.querySelector('input[name="nameEn"]')).toBeInTheDocument();
    });
    fireEvent.change(document.querySelector('input[name="nameEn"]')!, { target: { value: 'Books' } });

    fireEvent.submit(screen.getByText('Create').closest('form')!);

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith(
        '/categories',
        expect.objectContaining({ name: 'Книги', slug: 'books' }),
      );
    });
  });

  it('renders edit and delete buttons', async () => {
    renderPage();
    await screen.findByText('Electronics');
    expect(screen.getAllByTestId('icon-pencil')).toHaveLength(2);
    expect(screen.getAllByTestId('icon-trash')).toHaveLength(2);
  });

  it('clicking delete opens confirm modal with category name', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Electronics');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Delete category?')).toBeInTheDocument();
    expect(within(dialog).getByText(/Электроника/)).toBeInTheDocument();
  });

  it('confirming delete calls delete API', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Electronics');

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
    await screen.findByText('Electronics');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);
    await user.click(screen.getByRole('button', { name: 'Отмена' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockApiDelete).not.toHaveBeenCalled();
  });

  it('shows slug error inline when create returns Slug conflict', async () => {
    mockApiPost = jest.fn().mockRejectedValue(new Error('Slug уже занят, выберите другой'));
    renderPage();
    await screen.findByText('Electronics');

    fireEvent.change(screen.getByPlaceholderText('Electronics'), { target: { value: 'Новая' } });
    fireEvent.change(screen.getByPlaceholderText('electronics'), { target: { value: 'electronics' } });
    // Switch to EN tab, fill required nameEn, then switch back to UK tab
    fireEvent.click(screen.getByText('🇬🇧 EN'));
    await waitFor(() => {
      expect(document.querySelector('input[name="nameEn"]')).toBeInTheDocument();
    });
    fireEvent.change(document.querySelector('input[name="nameEn"]')!, { target: { value: 'New' } });
    // Switch back to UK tab to submit and see slug error
    fireEvent.click(screen.getByText('🇺🇦 UK'));
    await waitFor(() => {
      expect(document.querySelector('input[name="slug"]')).toBeInTheDocument();
    });
    fireEvent.submit(screen.getByText('Create').closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('This slug is already taken')).toBeInTheDocument();
    });
  });

  it('shows name error inline when create returns name conflict', async () => {
    mockApiPost = jest.fn().mockRejectedValue(new Error('name is already taken'));
    renderPage();
    await screen.findByText('Electronics');

    fireEvent.change(screen.getByPlaceholderText('Electronics'), { target: { value: 'Электроника' } });
    fireEvent.change(screen.getByPlaceholderText('electronics'), { target: { value: 'electronics-2' } });
    // Switch to EN tab, fill required nameEn, then switch back to UK tab
    fireEvent.click(screen.getByText('🇬🇧 EN'));
    await waitFor(() => {
      expect(document.querySelector('input[name="nameEn"]')).toBeInTheDocument();
    });
    fireEvent.change(document.querySelector('input[name="nameEn"]')!, { target: { value: 'Electronics' } });
    // Switch back to UK tab to submit and see name error
    fireEvent.click(screen.getByText('🇺🇦 UK'));
    await waitFor(() => {
      expect(document.querySelector('input[name="name"]')).toBeInTheDocument();
    });
    fireEvent.submit(screen.getByText('Create').closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('This name is already taken')).toBeInTheDocument();
    });
  });

  it('shows slug error inline when update returns Slug conflict', async () => {
    mockApiPut = jest.fn().mockRejectedValue(new Error('Slug уже занят, выберите другой'));
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Electronics');

    const pencilButtons = screen.getAllByTestId('icon-pencil');
    await user.click(pencilButtons[0].closest('button')!);
    fireEvent.submit(screen.getByText('Save').closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('This slug is already taken')).toBeInTheDocument();
    });
  });

  it('shows edit warning when editing category with products', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Electronics');

    const pencilButtons = screen.getAllByTestId('icon-pencil');
    await user.click(pencilButtons[0].closest('button')!);

    expect(screen.getByText(/Changes will apply to all/)).toBeInTheDocument();
    expect(screen.getByText(/5 products in this category/)).toBeInTheDocument();
  });
});
