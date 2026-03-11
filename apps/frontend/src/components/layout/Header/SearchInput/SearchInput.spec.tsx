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
  { id: '1', name: 'Apple iPhone 15', slug: 'apple-iphone-15' },
  { id: '2', name: 'Apple MacBook', slug: 'apple-macbook' },
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
    fireEvent.change(input, { target: { value: 'ip' } });
    expect(screen.queryByText('Apple iPhone 15')).not.toBeInTheDocument();
  });

  it('shows dropdown with suggestions on input', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'apple' } });

    expect(screen.getByText('Apple iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Apple MacBook')).toBeInTheDocument();
  });

  it('suggestion items are links to product pages', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'apple' } });

    const link = screen.getByText('Apple iPhone 15').closest('a');
    expect(link).toHaveAttribute('href', '/products/apple-iphone-15');
  });

  it('calls update with trimmed query on form submit', () => {
    mockUseSuggestions.mockReturnValue({ data: undefined });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.change(input, { target: { value: '  laptop  ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockUpdate).toHaveBeenCalledWith({ search: 'laptop' });
  });

  it('calls update with undefined on empty submit (clears search)', () => {
    mockUseSuggestions.mockReturnValue({ data: undefined });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Поиск товаров...');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockUpdate).toHaveBeenCalledWith({ search: undefined });
  });
});
