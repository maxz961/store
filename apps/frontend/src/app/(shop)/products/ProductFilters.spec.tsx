import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductFilters } from './ProductFilters';


const mockUpdate = jest.fn();
const mockReset = jest.fn();

jest.mock('@/lib/hooks/useProductParams', () => ({
  useProductParams: () => ({ update: mockUpdate, reset: mockReset }),
}));

jest.mock('@/lib/hooks/useProducts', () => ({
  usePriceRange: () => ({ data: { min: 100, max: 5000 } }),
}));

const categories = [
  { id: '1', name: 'Электроника', slug: 'electronics', _count: { products: 5 } },
  { id: '2', name: 'Одежда', slug: 'clothing', _count: { products: 3 } },
  { id: '3', name: 'Пустая', slug: 'empty', _count: { products: 0 } },
];

const tags = [
  { id: '1', name: 'Новинка', slug: 'new', _count: { products: 2 } },
  { id: '2', name: 'Скидка', slug: 'sale', _count: { products: 1 } },
  { id: '3', name: 'Нет товаров', slug: 'no-products', _count: { products: 0 } },
];

describe('ProductFilters', () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockReset.mockClear();
  });

  it('renders categories and tags with products', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    expect(screen.getByText('Все товары')).toBeInTheDocument();
    expect(screen.getByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('Одежда')).toBeInTheDocument();
    expect(screen.getByText('Новинка')).toBeInTheDocument();
    expect(screen.getByText('Скидка')).toBeInTheDocument();
  });

  it('does not render category with 0 products', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );
    expect(screen.queryByText('Пустая')).not.toBeInTheDocument();
  });

  it('does not render tag with 0 products', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );
    expect(screen.queryByText('Нет товаров')).not.toBeInTheDocument();
  });

  it('calls update with categorySlug on category click', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    await user.click(screen.getByText('Электроника'));
    expect(mockUpdate).toHaveBeenCalledWith({ categorySlug: 'electronics' });
  });

  it('calls update with undefined categorySlug on "Все товары" click', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters
        categories={categories}
        tags={tags}
        currentCategory="electronics"
        currentTags={[]}
      />,
    );

    await user.click(screen.getByText('Все товары'));
    expect(mockUpdate).toHaveBeenCalledWith({ categorySlug: undefined });
  });

  it('toggles tag on click — adds slug', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    await user.click(screen.getByText('Новинка'));
    expect(mockUpdate).toHaveBeenCalledWith({ tagSlugs: ['new'] });
  });

  it('toggles tag on click — removes slug', async () => {
    const user = userEvent.setup();
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={['new', 'sale']} />,
    );

    await user.click(screen.getByText('Новинка'));
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
    expect(screen.getByRole('combobox', { name: 'Сортировка' })).toBeInTheDocument();
  });

  it('calls update with sortBy and sortOrder on sort change', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    const select = screen.getByRole('combobox', { name: 'Сортировка' });
    fireEvent.change(select, { target: { value: 'price_asc' } });

    expect(mockUpdate).toHaveBeenCalledWith({ sortBy: 'price', sortOrder: 'asc' });
  });

  it('resets sort when empty option selected', () => {
    render(
      <ProductFilters
        categories={categories}
        tags={tags}
        currentTags={[]}
        currentSort="price_asc"
      />,
    );

    const select = screen.getByRole('combobox', { name: 'Сортировка' });
    fireEvent.change(select, { target: { value: '' } });

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

    expect(screen.getByText('Сбросить фильтры')).toBeInTheDocument();
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

    expect(screen.getByText('Сбросить фильтры')).toBeInTheDocument();
  });

  it('hides reset button when no filters active', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    expect(screen.queryByText('Сбросить фильтры')).not.toBeInTheDocument();
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

    await user.click(screen.getByText('Сбросить фильтры'));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
