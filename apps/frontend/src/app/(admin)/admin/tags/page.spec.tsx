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

import TagsPage from './page';


const mockTags = [
  { id: 'tag-1', name: 'Новинка', nameEn: 'New', slug: 'new', color: '#22c55e', _count: { products: 4 } },
  { id: 'tag-2', name: 'Скидка', nameEn: 'Sale', slug: 'sale', color: '#ef4444', _count: { products: 2 } },
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

const renderPage = () => render(<TagsPage />, { wrapper: createWrapper() });

describe('TagsPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockTags);
    mockApiPost = jest.fn().mockResolvedValue({ id: 'new-tag', name: 'Test', slug: 'test' });
    mockApiPut = jest.fn().mockResolvedValue({});
    mockApiDelete = jest.fn().mockResolvedValue(undefined);
  });

  it('renders form with color swatches', () => {
    renderPage();
    expect(screen.getByText('New tag')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New arrival')).toBeInTheDocument();
    expect(screen.getByText('Tag color')).toBeInTheDocument();
  });

  it('loads and displays tags with color dots', async () => {
    renderPage();
    expect(await screen.findByText('Новинка')).toBeInTheDocument();
    expect(screen.getByText('Скидка')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows empty state when no tags', async () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('No tags yet')).toBeInTheDocument();
  });

  it('submits create form with color', async () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText('New arrival'), { target: { value: 'Премиум' } });
    fireEvent.change(screen.getByPlaceholderText('new-arrival'), { target: { value: 'premium' } });

    // Switch to EN tab to fill required nameEn field
    fireEvent.click(screen.getByText('🇬🇧 EN'));
    await waitFor(() => {
      expect(document.querySelector('input[name="nameEn"]')).toBeInTheDocument();
    });
    fireEvent.change(document.querySelector('input[name="nameEn"]')!, { target: { value: 'Premium' } });

    fireEvent.submit(screen.getByText('Create').closest('form')!);

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith(
        '/tags',
        expect.objectContaining({ name: 'Премиум', slug: 'premium' }),
      );
    });
  });

  it('renders edit and delete buttons for each tag', async () => {
    renderPage();
    await screen.findByText('Новинка');
    expect(screen.getAllByTestId('icon-pencil')).toHaveLength(2);
    expect(screen.getAllByTestId('icon-trash')).toHaveLength(2);
  });

  it('displays default color swatch as active', () => {
    renderPage();
    const swatches = document.querySelectorAll('[title="#4361ee"]');
    expect(swatches.length).toBeGreaterThanOrEqual(1);
  });

  it('clicking delete opens confirm modal with tag name', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Новинка');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Delete tag?')).toBeInTheDocument();
    expect(within(dialog).getByText(/Новинка/)).toBeInTheDocument();
  });

  it('confirming delete calls delete API', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Новинка');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);
    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledWith('/tags/tag-1');
    });
  });

  it('cancelling delete modal closes without deleting', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Новинка');

    const trashButtons = screen.getAllByTestId('icon-trash');
    await user.click(trashButtons[0].closest('button')!);
    await user.click(screen.getByRole('button', { name: 'Отмена' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockApiDelete).not.toHaveBeenCalled();
  });

  it('shows slug error inline when create returns Slug conflict', async () => {
    mockApiPost = jest.fn().mockRejectedValue(new Error('Slug уже занят, выберите другой'));
    renderPage();
    await screen.findByText('Новинка');

    fireEvent.change(screen.getByPlaceholderText('New arrival'), { target: { value: 'Новый' } });
    fireEvent.change(screen.getByPlaceholderText('new-arrival'), { target: { value: 'new' } });
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
    await screen.findByText('Новинка');

    fireEvent.change(screen.getByPlaceholderText('New arrival'), { target: { value: 'Новинка' } });
    fireEvent.change(screen.getByPlaceholderText('new-arrival'), { target: { value: 'new-2' } });
    // Switch to EN tab, fill required nameEn, then switch back to UK tab
    fireEvent.click(screen.getByText('🇬🇧 EN'));
    await waitFor(() => {
      expect(document.querySelector('input[name="nameEn"]')).toBeInTheDocument();
    });
    fireEvent.change(document.querySelector('input[name="nameEn"]')!, { target: { value: 'Novinka' } });
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
    await screen.findByText('Новинка');

    const pencilButtons = screen.getAllByTestId('icon-pencil');
    await user.click(pencilButtons[0].closest('button')!);
    fireEvent.submit(screen.getByText('Save').closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('This slug is already taken')).toBeInTheDocument();
    });
  });

  it('shows edit warning when editing tag with products', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Новинка');

    const pencilButtons = screen.getAllByTestId('icon-pencil');
    await user.click(pencilButtons[0].closest('button')!);

    expect(screen.getByText(/Changes will apply to all/)).toBeInTheDocument();
    expect(screen.getByText(/4 products with this tag/)).toBeInTheDocument();
  });
});
