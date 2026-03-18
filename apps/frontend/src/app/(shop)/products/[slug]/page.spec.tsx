import { render, screen, fireEvent, act } from '@testing-library/react';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'product.addToCart': 'Add to cart',
        'product.inCart': 'In cart',
        'product.adding': 'Adding...',
        'product.outOfStock': 'Out of stock',
        'product.noPhoto': 'No photo',
        'product.inStock': 'In stock',
        'product.pieces': 'pcs.',
        'product.reviews': 'Reviews',
        'product.noReviews': 'No reviews yet',
        'product.description': 'Description',
        'product.category': 'Category',
        'product.tags': 'Tags',
        'product.notFound': 'Product not found',
        'product.notFoundText': 'It may have been deleted or the link is invalid',
        'product.similar': 'Similar products',
        'product.recentlyViewed': 'Recently viewed',
        'product.showAllReviews': 'Show all',
        'product.writeReview': 'Write a review',
        'product.reviewsOne': 'review',
        'product.reviewsFew': 'reviews',
        'product.reviewsMany': 'reviews',
        'catalog.title': 'Catalog',
        'favorites.empty': 'No favorites yet',
        'favorites.title': 'Favorites',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/products/test-product',
}));

jest.mock('lucide-react', () => ({
  ImageOff: (props: any) => <div data-testid="icon-imageoff" {...props} />,
  Star: (props: any) => <div data-testid="icon-star" {...props} />,
  ShoppingCart: (props: any) => <div data-testid="icon-cart" {...props} />,
  Check: (props: any) => <div data-testid="icon-check" {...props} />,
  Minus: (props: any) => <div data-testid="icon-minus" {...props} />,
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
  MessageSquare: (props: any) => <div data-testid="icon-message" {...props} />,
  Heart: (props: any) => <div data-testid="icon-heart" {...props} />,
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: false }),
}));

jest.mock('@/lib/hooks/useFavorites', () => ({
  useFavoriteIds: () => ({ data: [] }),
  useAddFavorite: () => ({ mutate: jest.fn() }),
  useRemoveFavorite: () => ({ mutate: jest.fn() }),
}));

import { ProductPageClient as ProductPage } from './ProductPageClient';


const mockAddItem = jest.fn();

const baseProduct = {
  id: 'p1',
  name: 'Test Product',
  nameEn: 'Test Product',
  slug: 'test-product',
  price: 199.99,
  comparePrice: null,
  images: ['https://example.com/img.jpg'],
  stock: 10,
  description: 'Product description',
  descriptionEn: 'Product description',
  sku: 'SKU-001',
  category: { name: 'Electronics', nameEn: 'Electronics', slug: 'electronics' },
  tags: [{ tag: { name: 'New', nameEn: 'New', slug: 'new' } }],
  reviews: [{ rating: 5 }, { rating: 4 }],
};

let mockProductHook: any;

jest.mock('@/lib/hooks/useProducts', () => ({
  useProduct: () => mockProductHook,
}));

jest.mock('@/components/review/ReviewModal', () => ({
  ReviewModal: ({ productId, onClose }: any) => (


    <div data-testid="review-modal">
      ReviewModal-{productId}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

jest.mock('./SimilarProducts', () => ({
  SimilarProducts: () => <div data-testid="similar-products">Similar</div>,
}));

jest.mock('./RecentlyViewed', () => ({
  RecentlyViewed: () => <div data-testid="recently-viewed">Recent</div>,
}));

jest.mock('./useTrackProductView', () => ({
  useTrackProductView: jest.fn(),
}));

jest.mock('@/store/cart', () => ({
  useCartStore: (selector?: (state: any) => any) =>
    selector ? selector({ addItem: mockAddItem }) : { addItem: mockAddItem },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: any) => <img {...props} />,
}));

describe('ProductPage', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
    mockProductHook = {
      data: { ...baseProduct },
      isLoading: false,
      isError: false,
    };
  });

  const renderPage = async () => {
    await act(async () => {
      render(<ProductPage slug="test-product" />);
    });
  };

  it('renders product name and price', async () => {
    await renderPage();
    expect(screen.getByRole('heading', { name: 'Test Product' })).toBeInTheDocument();
    expect(screen.getByText('199,99 ₴')).toBeInTheDocument();
  });

  it('renders category name', async () => {
    await renderPage();
    expect(screen.getAllByText('Electronics').length).toBeGreaterThanOrEqual(1);
  });

  it('renders stock status when in stock', async () => {
    await renderPage();
    expect(screen.getByText('In stock: 10 pcs.')).toBeInTheDocument();
  });

  it('renders out of stock message', async () => {
    mockProductHook = { ...mockProductHook, data: { ...baseProduct, stock: 0 } };
    await renderPage();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    mockProductHook = { data: undefined, isLoading: true, isError: false };
    await renderPage();
    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
  });

  it('shows error state when product not found', async () => {
    mockProductHook = { data: undefined, isLoading: false, isError: true };
    await renderPage();
    expect(screen.getByText('Product not found')).toBeInTheDocument();
    expect(screen.getByText('It may have been deleted or the link is invalid')).toBeInTheDocument();
  });

  it('renders reviews summary with count and rating', async () => {
    await renderPage();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText(/4\.5 · 2 reviews/)).toBeInTheDocument();
    expect(screen.getByText('Show all')).toBeInTheDocument();
  });

  it('shows "Write a review" button when no reviews', async () => {
    mockProductHook = { ...mockProductHook, data: { ...baseProduct, reviews: [] } };
    await renderPage();
    expect(screen.getByText('Write a review')).toBeInTheDocument();
  });

  it('opens ReviewModal when "Show all" is clicked', async () => {
    await renderPage();
    expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Show all'));
    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
  });

  it('renders add to cart button and calls addItem on click', async () => {
    await renderPage();
    const button = screen.getByText('Add to cart');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockAddItem).toHaveBeenCalledTimes(1);
  });

  it('shows loading state immediately after clicking add to cart', async () => {
    jest.useFakeTimers();
    await renderPage();
    fireEvent.click(screen.getByText('Add to cart'));
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('shows success state after add to cart animation completes', async () => {
    jest.useFakeTimers();
    await renderPage();
    fireEvent.click(screen.getByText('Add to cart'));
    act(() => jest.advanceTimersByTime(700));
    expect(screen.getByText('In cart')).toBeInTheDocument();
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('renders tags', async () => {
    await renderPage();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    await renderPage();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
  });

  it('renders product description', async () => {
    await renderPage();
    expect(screen.getByText('Product description')).toBeInTheDocument();
  });

  it('renders discount when comparePrice exists', async () => {
    mockProductHook = {
      ...mockProductHook,
      data: { ...baseProduct, comparePrice: 299.99 },
    };
    await renderPage();
    expect(screen.getByText('299,99 ₴')).toBeInTheDocument();
    expect(screen.getByText('-33%')).toBeInTheDocument();
  });
});
