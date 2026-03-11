import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from './SearchInput';


jest.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />,
}));

const mockUpdate = jest.fn();
const mockGet = jest.fn().mockReturnValue(undefined);

jest.mock('@/lib/hooks/useProductParams', () => ({
  useProductParams: () => ({ get: mockGet, update: mockUpdate }),
}));

const mockUseSuggestions = jest.fn();

jest.mock('@/lib/hooks/useProducts', () => ({
  useSearchSuggestions: (...args: unknown[]) => mockUseSuggestions(...args),
}));


const products = [
  { id: '1', name: 'RTX 5070', slug: 'rtx-5070' },
  { id: '2', name: 'RTX 5080', slug: 'rtx-5080' },
];

describe('SearchInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSuggestions.mockReturnValue({ data: undefined });
  });

  it('renders search input', () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText('Поиск товаров...')).toBeInTheDocument();
  });

  it('hides dropdown when no suggestions', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.change(input, { target: { value: 'rt' } });
    expect(screen.queryByText('RTX 5070')).not.toBeInTheDocument();
  });

  it('shows dropdown with suggestions on input', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rtx' } });

    expect(screen.getByText('RTX 5070')).toBeInTheDocument();
    expect(screen.getByText('RTX 5080')).toBeInTheDocument();
  });

  it('clicking suggestion fills input and applies search', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rtx' } });

    fireEvent.click(screen.getByText('RTX 5070'));

    expect(mockUpdate).toHaveBeenCalledWith({ search: 'RTX 5070' });
    expect(input).toHaveValue('RTX 5070');
  });

  it('suggestions are buttons, not links', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rtx' } });

    const btn = screen.getByText('RTX 5070').closest('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('calls update with trimmed query on form submit', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.change(input, { target: { value: '  laptop  ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockUpdate).toHaveBeenCalledWith({ search: 'laptop' });
  });

  it('calls update with undefined on empty submit (clears search)', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockUpdate).toHaveBeenCalledWith({ search: undefined });
  });
});
