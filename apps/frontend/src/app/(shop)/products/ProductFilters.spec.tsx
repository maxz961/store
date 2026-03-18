import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductFilters } from './ProductFilters';


jest.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-chevron-down" {...props} />,
}));

jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'catalog.sort': 'Sort by',
        'catalog.sortDefault': 'Default',
        'catalog.sortNewest': 'Newest',
        'catalog.sortCheapest': 'Price: low to high',
        'catalog.sortMostExpensive': 'Price: high to low',
        'catalog.categories': 'Categories',
        'catalog.allProducts': 'All products',
        'catalog.tags': 'Tags',
        'catalog.price': 'Price',
        'catalog.resetFilters': 'Reset filters',
      };
      return map[key] ?? key;
    },
  }),
}));


const mockUpdate = jest.fn();
const mockReset = jest.fn();

jest.mock('@/lib/hooks/useProductParams', () => ({
  useProductParams: () => ({ update: mockUpdate, reset: mockReset }),
}));

const mockUsePriceRange = jest.fn(() => ({ data: { min: 100, max: 5000 } }));

jest.mock('@/lib/hooks/useProducts', () => ({
  usePriceRange: () => mockUsePriceRange(),
}));

const categories = [
  { id: '1', name: 'Electronics', slug: 'electronics', _count: { products: 5 } },
  { id: '2', name: 'Clothing', slug: 'clothing', _count: { products: 3 } },
  { id: '3', name: 'Empty', slug: 'empty', _count: { products: 0 } },
];

const tags = [
  { id: '1', name: 'New', slug: 'new', _count: { products: 2 } },
  { id: '2', name: 'Sale', slug: 'sale', _count: { products: 1 } },
  { id: '3', name: 'No products', slug: 'no-products', _count: { products: 0 } },
];

describe('ProductFilters', () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockReset.mockClear();
    mockUsePriceRange.mockReturnValue({ data: { min: 100, max: 5000 } });
  });

  it('renders without crash when priceRange is still loading (data=undefined)', () => {
    mockUsePriceRange.mockReturnValue({ data: undefined });
    expect(() =>
      render(<ProductFilters categories={categories} tags={tags} currentTags={[]} />),
    ).not.toThrow();
  });

  it('renders categories and tags with products', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    expect(screen.getByText('All products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('does not render category with 0 products', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );
    expect(screen.queryByText('Empty')).not.toBeInTheDocument();
  });

  it('does not render tag with 0 products', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );
    expect(screen.queryByText('No products')).not.toBeInTheDocument();
  });

  it('calls update with categorySlug on category click', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    await user.click(screen.getByText('Electronics'));
    expect(mockUpdate).toHaveBeenCalledWith({ categorySlug: 'electronics' });
  });

  it('calls update with undefined categorySlug on "All products" click', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters
        categories={categories}
        tags={tags}
        currentCategory="electronics"
        currentTags={[]}
      />,
    );

    await user.click(screen.getByText('All products'));
    expect(mockUpdate).toHaveBeenCalledWith({ categorySlug: undefined });
  });

  it('toggles tag on click — adds slug', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    await user.click(screen.getByText('New'));
    expect(mockUpdate).toHaveBeenCalledWith({ tagSlugs: ['new'] });
  });

  it('toggles tag on click — removes slug', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={['new', 'sale']} />,
    );

    await user.click(screen.getByText('New'));
    expect(mockUpdate).toHaveBeenCalledWith({ tagSlugs: ['sale'] });
  });

  it('renders price range slider inputs', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );
    expect(screen.getByLabelText('Минимальная цена')).toBeInTheDocument();
    expect(screen.getByLabelText('Максимальная цена')).toBeInTheDocument();
  });

  it('calls update on price range change (mouseUp on slider)', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    const sliders = screen.getAllByLabelText(/слайдер/);
    fireEvent.mouseUp(sliders[0]);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ minPrice: expect.any(String), maxPrice: expect.any(String) }),
    );
  });

  it('renders sort select', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sort by' })).toBeInTheDocument();
  });

  it('calls update with sortBy and sortOrder on sort change', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    await user.click(screen.getByRole('button', { name: 'Sort by' }));
    await user.click(screen.getByRole('option', { name: 'Price: low to high' }));

    expect(mockUpdate).toHaveBeenCalledWith({ sortBy: 'price', sortOrder: 'asc' });
  });

  it('resets sort when empty option selected', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters
        categories={categories}
        tags={tags}
        currentTags={[]}
        currentSort="price_asc"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Sort by' }));
    await user.click(screen.getByRole('option', { name: 'Default' }));

    expect(mockUpdate).toHaveBeenCalledWith({ sortBy: undefined, sortOrder: undefined });
  });

  it('shows reset button when filters active', () => {
    render(
      <ProductFilters
        categories={categories}
        tags={tags}
        currentCategory="electronics"
        currentTags={[]}
      />,
    );

    expect(screen.getByText('Reset filters')).toBeInTheDocument();
  });

  it('shows reset button when minPrice is set', () => {
    render(
      <ProductFilters
        categories={categories}
        tags={tags}
        currentTags={[]}
        currentMinPrice="100"
      />,
    );

    expect(screen.getByText('Reset filters')).toBeInTheDocument();
  });

  it('hides reset button when no filters active', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    expect(screen.queryByText('Reset filters')).not.toBeInTheDocument();
  });

  it('calls reset on reset button click', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters
        categories={categories}
        tags={tags}
        currentCategory="electronics"
        currentTags={['new']}
      />,
    );

    await user.click(screen.getByText('Reset filters'));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
