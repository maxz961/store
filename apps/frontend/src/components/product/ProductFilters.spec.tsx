import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductFilters } from './ProductFilters';

const mockUpdate = jest.fn();
const mockReset = jest.fn();

jest.mock('@/lib/hooks/useProductParams', () => ({
  useProductParams: () => ({ update: mockUpdate, reset: mockReset }),
}));

const categories = [
  { id: '1', name: 'Электроника', slug: 'electronics' },
  { id: '2', name: 'Одежда', slug: 'clothing' },
];

const tags = [
  { id: '1', name: 'Новинка', slug: 'new' },
  { id: '2', name: 'Скидка', slug: 'sale' },
];

describe('ProductFilters', () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockReset.mockClear();
  });

  it('renders categories and tags', () => {
    render(
      <ProductFilters categories={categories} tags={tags} currentTags={[]} />,
    );

    expect(screen.getByText('Все товары')).toBeInTheDocument();
    expect(screen.getByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('Одежда')).toBeInTheDocument();
    expect(screen.getByText('Новинка')).toBeInTheDocument();
    expect(screen.getByText('Скидка')).toBeInTheDocument();
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
