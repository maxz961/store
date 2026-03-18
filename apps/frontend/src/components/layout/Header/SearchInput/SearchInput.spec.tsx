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

jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ lang: 'en', t: (key: string) => key === 'catalog.search' ? 'Search products...' : key }),
}));

jest.mock('@/lib/utils', () => ({
  getLocalizedText: (_lang: string, uk: string, en?: string | null) => en ?? uk,
}));


const products = [
  { id: '1', name: 'Відеокарта RTX 5070', nameEn: 'RTX 5070', slug: 'rtx-5070' },
  { id: '2', name: 'Відеокарта RTX 5080', nameEn: 'RTX 5080', slug: 'rtx-5080' },
];

describe('SearchInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSuggestions.mockReturnValue({ data: undefined });
  });

  it('renders search input', () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('hides dropdown when no suggestions', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'rt' } });
    expect(screen.queryByText('RTX 5070')).not.toBeInTheDocument();
  });

  it('shows dropdown with suggestions on input', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rtx' } });

    expect(screen.getByText('RTX 5070')).toBeInTheDocument();
    expect(screen.getByText('RTX 5080')).toBeInTheDocument();
  });

  it('clicking suggestion fills input and applies search', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rtx' } });

    fireEvent.click(screen.getByText('RTX 5070'));

    expect(mockUpdate).toHaveBeenCalledWith({ search: 'RTX 5070' });
    expect(input).toHaveValue('RTX 5070');
  });

  it('suggestions are buttons, not links', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rtx' } });

    const btn = screen.getByText('RTX 5070').closest('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('calls update with trimmed query on form submit', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: '  laptop  ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockUpdate).toHaveBeenCalledWith({ search: 'laptop' });
  });

  it('calls update with undefined on empty submit (clears search)', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockUpdate).toHaveBeenCalledWith({ search: undefined });
  });

  it('dropdown shows nameEn when language is English (regression: was always showing Ukrainian name)', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rtx' } });

    expect(screen.getByText('RTX 5070')).toBeInTheDocument();
    expect(screen.queryByText('Відеокарта RTX 5070')).not.toBeInTheDocument();
  });

  it('clicking English suggestion fills input with English name', () => {
    mockUseSuggestions.mockReturnValue({ data: { items: products } });

    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rtx' } });
    fireEvent.click(screen.getByText('RTX 5070'));

    expect(mockUpdate).toHaveBeenCalledWith({ search: 'RTX 5070' });
    expect(input).toHaveValue('RTX 5070');
  });
});
