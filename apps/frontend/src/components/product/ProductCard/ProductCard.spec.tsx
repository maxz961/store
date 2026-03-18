import { render, screen, fireEvent, act } from '@testing-library/react';
import type { Product } from './ProductCard.types';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'product.addToCart': 'Add to cart',
        'product.inCart': 'In cart',
        'product.outOfStock': 'Out of stock',
        'product.noPhoto': 'No photo',
        'favorites.title': 'Favorites',
        'favorites.empty': 'No favorites yet',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('lucide-react', () => ({
  ShoppingCart: (props: Record<string, unknown>) => <div data-testid="icon-cart" {...props} />,
  ImageOff: (props: Record<string, unknown>) => <div data-testid="icon-image-off" {...props} />,
  Heart: (props: Record<string, unknown>) => <div data-testid="icon-heart" {...props} />,
  Check: (props: Record<string, unknown>) => <div data-testid="icon-check" {...props} />,
}));

jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: false }),
}));

jest.mock('@/lib/hooks/useFavorites', () => ({
  useFavoriteIds: () => ({ data: [] }),
  useAddFavorite: () => ({ mutate: jest.fn() }),
  useRemoveFavorite: () => ({ mutate: jest.fn() }),
}));

const mockAddItem = jest.fn();
jest.mock('@/store/cart', () => ({
  useCartStore: (selector: (state: { addItem: typeof mockAddItem }) => unknown) =>
    selector({ addItem: mockAddItem }),
}));

jest.mock('next/image', () => {
  const MockImage = (props: Record<string, unknown>) => {
    const { fill, src, alt, ...rest } = props;
    return <div data-testid="mock-image" data-src={src as string} data-alt={alt as string} data-fill={fill ? 'true' : undefined} {...rest} />;
  };
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

jest.mock('@/components/ui/StarRating', () => {
  const MockStarRating = ({ value }: { value: number }) => (
    <span data-testid="star-rating">{value} stars</span>
  );
  MockStarRating.displayName = 'MockStarRating';
  return { StarRating: MockStarRating };
});

jest.mock('react-if', () => ({
  If: ({ condition, children }: { condition: boolean; children: React.ReactNode[] }) => {
    const childArray = Array.isArray(children) ? children : [children];
    return condition ? childArray[0] : childArray[1] ?? null;
  },
  Then: ({ children }: { children: React.ReactNode }) => children,
  Else: ({ children }: { children: React.ReactNode }) => children,
  When: ({ condition, children }: { condition: boolean; children: React.ReactNode }) =>
    condition ? children : null,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <span data-testid="badge" {...props}>{children}</span>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <button {...props}>{children}</button>
  ),
}));

import { ProductCard } from './ProductCard';


const baseProduct: Product = {
  id: '1',
  name: 'Тестовый товар',
  slug: 'test-product',
  price: 99.99,
  images: ['https://example.com/img.jpg'],
  stock: 10,
  category: { name: 'Электроника', slug: 'electronics' },
  tags: [{ tag: { name: 'Новинка', slug: 'new' } }],
  reviews: [{ rating: 5 }, { rating: 3 }],
};


describe('ProductCard', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
  });

  it('renders product name, category and price', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('Тестовый товар')).toBeInTheDocument();
    expect(screen.getByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('99,99 ₴')).toBeInTheDocument();
  });

  it('links to product page', () => {
    render(<ProductCard product={baseProduct} />);
    const links = screen.getAllByRole('link');
    const productLinks = links.filter(
      (link) => link.getAttribute('href') === '/products/test-product'
    );
    expect(productLinks.length).toBeGreaterThan(0);
  });

  it('renders tags', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('Новинка')).toBeInTheDocument();
  });

  it('renders star rating when reviews exist', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId('star-rating')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
  });

  it('does not crash when reviews is undefined', () => {
    const product: Product = { ...baseProduct, reviews: undefined };
    expect(() => render(<ProductCard product={product} />)).not.toThrow();
  });

  it('does not crash when tags is undefined', () => {
    const product: Product = { ...baseProduct, tags: undefined };
    expect(() => render(<ProductCard product={product} />)).not.toThrow();
  });

  it('does not show rating when reviews are empty', () => {
    const product = { ...baseProduct, reviews: [] };
    render(<ProductCard product={product} />);
    expect(screen.queryByTestId('star-rating')).not.toBeInTheDocument();
  });

  it('shows discount badge when comparePrice exists', () => {
    const product = { ...baseProduct, comparePrice: 149.99 };
    render(<ProductCard product={product} />);
    expect(screen.getByText('-33%')).toBeInTheDocument();
    expect(screen.getByText('149,99 ₴')).toBeInTheDocument();
  });

  it('does not show discount badge without comparePrice', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });

  it('shows out of stock when stock is 0', () => {
    const product = { ...baseProduct, stock: 0 };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
    expect(screen.queryByLabelText('Add to cart')).not.toBeInTheDocument();
  });

  it('shows cart button when in stock', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByLabelText('Add to cart')).toBeInTheDocument();
  });

  it('calls addItem when cart button is clicked', () => {
    render(<ProductCard product={baseProduct} />);
    fireEvent.click(screen.getByLabelText('Add to cart'));
    expect(mockAddItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Тестовый товар',
      price: 99.99,
      imageUrl: 'https://example.com/img.jpg',
      slug: 'test-product',
      stock: 10,
    });
  });

  it('shows spinner while loading after clicking cart button', () => {
    jest.useFakeTimers();
    render(<ProductCard product={baseProduct} />);
    fireEvent.click(screen.getByLabelText('Add to cart'));
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-cart')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('shows success state after add to cart animation completes', () => {
    jest.useFakeTimers();
    render(<ProductCard product={baseProduct} />);
    fireEvent.click(screen.getByLabelText('Add to cart'));
    act(() => jest.advanceTimersByTime(700));
    expect(screen.getByLabelText('In cart')).toBeInTheDocument();
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    expect(screen.getByText('In cart')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('shows placeholder when images array is empty', () => {
    const product = { ...baseProduct, images: [] };
    render(<ProductCard product={product} />);
    expect(screen.getByText('No photo')).toBeInTheDocument();
  });

  it('limits tags to 3', () => {
    const product = {
      ...baseProduct,
      tags: [
        { tag: { name: 'Тег 1', slug: 'tag-1' } },
        { tag: { name: 'Тег 2', slug: 'tag-2' } },
        { tag: { name: 'Тег 3', slug: 'tag-3' } },
        { tag: { name: 'Тег 4', slug: 'tag-4' } },
      ],
    };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Тег 1')).toBeInTheDocument();
    expect(screen.getByText('Тег 3')).toBeInTheDocument();
    expect(screen.queryByText('Тег 4')).not.toBeInTheDocument();
  });
});
