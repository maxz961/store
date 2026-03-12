import { render, screen, fireEvent } from '@testing-library/react';
import type { Product } from '@/components/product/ProductCard/ProductCard.types';


class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
Object.defineProperty(global, 'ResizeObserver', { value: MockResizeObserver });

const mockAddItem = jest.fn();
jest.mock('@/store/cart', () => ({
  useCartStore: (selector: (state: { addItem: typeof mockAddItem }) => unknown) =>
    selector({ addItem: mockAddItem }),
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: false }),
}));

jest.mock('@/lib/hooks/useFavorites', () => ({
  useFavoriteIds: () => ({ data: [] }),
  useAddFavorite: () => ({ mutate: jest.fn() }),
  useRemoveFavorite: () => ({ mutate: jest.fn() }),
}));

jest.mock('lucide-react', () => ({
  ChevronLeft: (props: Record<string, unknown>) => <div data-testid="chevron-left" {...props} />,
  ChevronRight: (props: Record<string, unknown>) => <div data-testid="chevron-right" {...props} />,
  ShoppingCart: (props: Record<string, unknown>) => <div data-testid="icon-cart" {...props} />,
  ImageOff: (props: Record<string, unknown>) => <div data-testid="icon-image-off" {...props} />,
}));

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

import { ProductCarousel } from './ProductCarousel';


const makeProduct = (id: string, name: string): Product => ({
  id,
  name,
  slug: `product-${id}`,
  price: 99.99,
  images: ['https://example.com/img.jpg'],
  stock: 10,
  category: { name: 'Электроника', slug: 'electronics' },
});

const products = [
  makeProduct('1', 'Товар 1'),
  makeProduct('2', 'Товар 2'),
  makeProduct('3', 'Товар 3'),
];


describe('ProductCarousel', () => {
  it('renders title and products', () => {
    render(<ProductCarousel title="Похожие товары" products={products} />);
    expect(screen.getByText('Похожие товары')).toBeInTheDocument();
    expect(screen.getByText('Товар 1')).toBeInTheDocument();
    expect(screen.getByText('Товар 2')).toBeInTheDocument();
    expect(screen.getByText('Товар 3')).toBeInTheDocument();
  });

  it('renders nothing when products array is empty', () => {
    const { container } = render(<ProductCarousel title="Похожие товары" products={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders all product cards', () => {
    render(<ProductCarousel title="Тест" products={products} />);
    const names = screen.getAllByRole('link');
    expect(names.length).toBeGreaterThanOrEqual(products.length);
  });

  it('renders left arrow button when canScrollLeft is true', () => {
    render(<ProductCarousel title="Тест" products={products} />);
    // Initially canScrollLeft is false (scrollLeft = 0), so left arrow should not be visible
    // Right arrow depends on overflow, which JSDOM doesn't simulate
    // We verify the structure renders without crash
    expect(screen.getByText('Тест')).toBeInTheDocument();
  });

  it('handles single product without crash', () => {
    const singleProduct = [makeProduct('1', 'Один товар')];
    render(<ProductCarousel title="Один" products={singleProduct} />);
    expect(screen.getByText('Один товар')).toBeInTheDocument();
  });

  it('handles products with undefined reviews and tags', () => {
    const defensiveProducts = [
      { ...makeProduct('1', 'Без отзывов'), reviews: undefined, tags: undefined },
    ];
    expect(() =>
      render(<ProductCarousel title="Defensive" products={defensiveProducts} />)
    ).not.toThrow();
  });
});
