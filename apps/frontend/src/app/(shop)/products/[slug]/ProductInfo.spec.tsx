import { render, screen, fireEvent } from '@testing-library/react';


jest.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid="icon-cart" />,
  Minus: () => <div data-testid="icon-minus" />,
  Plus: () => <div data-testid="icon-plus" />,
  Heart: () => <div data-testid="icon-heart" />,
  Check: () => <div data-testid="icon-check" />,
}));

import { ProductInfo } from './ProductInfo';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    t: (key: string) => ({
      'product.inStock': 'In stock',
      'product.outOfStock': 'Out of stock',
      'product.pieces': 'pcs',
      'product.addToCart': 'Add to cart',
      'product.adding': 'Adding...',
      'product.inCart': 'In cart',
      'favorites.title': 'Add to favorites',
      'favorites.empty': 'Remove from favorites',
    }[key] ?? key),
  }),
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
  getLocalizedText: (_lang: string, uk: string, en?: string | null) => en ?? uk,
}));

jest.mock('@/lib/constants/format', () => ({
  formatCurrency: (v: number) => `$${v}`,
}));

const mockAddItem = jest.fn();

jest.mock('@/store/cart', () => ({
  useCartStore: (selector: (s: { addItem: jest.Mock }) => unknown) =>
    selector({ addItem: mockAddItem }),
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

const mockAddFavorite = { mutate: jest.fn(), isPending: false };
const mockRemoveFavorite = { mutate: jest.fn(), isPending: false };

jest.mock('@/lib/hooks/useFavorites', () => ({
  useFavoriteIds: () => ({ data: [] }),
  useAddFavorite: () => mockAddFavorite,
  useRemoveFavorite: () => mockRemoveFavorite,
}));

jest.mock('@/components/ui/StarRating', () => ({
  StarRating: () => <div data-testid="star-rating" />,
}));

jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));


const product = {
  id: 'p1',
  name: 'Товар',
  nameEn: 'Product',
  slug: 'product',
  price: 100,
  images: [],
  stock: 10,
  category: { name: 'Категорія', nameEn: 'Category', slug: 'cat' },
  tags: [],
  reviews: [],
  description: 'Опис',
  descriptionEn: 'Description',
};


describe('ProductInfo previewMode', () => {
  beforeEach(() => {
    mockAddItem.mockReset();
    mockAddFavorite.mutate.mockReset();
    mockRemoveFavorite.mutate.mockReset();
  });

  it('does NOT add to cart when previewMode=true', () => {
    render(<ProductInfo product={product} previewMode />);
    fireEvent.click(screen.getByText('Add to cart'));
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('does NOT toggle favorites when previewMode=true', () => {
    render(<ProductInfo product={product} previewMode />);
    fireEvent.click(screen.getByLabelText('Add to favorites'));
    expect(mockAddFavorite.mutate).not.toHaveBeenCalled();
    expect(mockRemoveFavorite.mutate).not.toHaveBeenCalled();
  });

  it('adds to cart when previewMode is not set', () => {
    render(<ProductInfo product={product} />);
    fireEvent.click(screen.getByText('Add to cart'));
    expect(mockAddItem).toHaveBeenCalled();
  });

  it('renders product name from nameEn when lang=en', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument();
  });
});
