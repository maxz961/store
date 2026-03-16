import { Suspense } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';


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

import ProductPage from './page';


const mockAddItem = jest.fn();

const baseProduct = {
  id: 'p1',
  name: 'Тестовый товар',
  slug: 'test-product',
  price: 199.99,
  comparePrice: null,
  images: ['https://example.com/img.jpg'],
  stock: 10,
  description: 'Описание товара',
  sku: 'SKU-001',
  category: { name: 'Электроника', slug: 'electronics' },
  tags: [{ tag: { name: 'Новинка', slug: 'new' } }],
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
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <ProductPage params={Promise.resolve({ slug: 'test-product' })} />
        </Suspense>
      );
    });
  };

  it('renders product name and price', async () => {
    await renderPage();
    expect(screen.getByRole('heading', { name: 'Тестовый товар' })).toBeInTheDocument();
    expect(screen.getByText('199,99 ₴')).toBeInTheDocument();
  });

  it('renders category name', async () => {
    await renderPage();
    expect(screen.getAllByText('Электроника').length).toBeGreaterThanOrEqual(1);
  });

  it('renders stock status when in stock', async () => {
    await renderPage();
    expect(screen.getByText('В наличии: 10 шт.')).toBeInTheDocument();
  });

  it('renders out of stock message', async () => {
    mockProductHook = { ...mockProductHook, data: { ...baseProduct, stock: 0 } };
    await renderPage();
    expect(screen.getByText('Нет в наличии')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    mockProductHook = { data: undefined, isLoading: true, isError: false };
    await renderPage();
    expect(screen.queryByText('Тестовый товар')).not.toBeInTheDocument();
  });

  it('shows error state when product not found', async () => {
    mockProductHook = { data: undefined, isLoading: false, isError: true };
    await renderPage();
    expect(screen.getByText('Товар не найден')).toBeInTheDocument();
    expect(screen.getByText('Возможно, он был удалён или ссылка неверна')).toBeInTheDocument();
  });

  it('renders reviews summary with count and rating', async () => {
    await renderPage();
    expect(screen.getByText('Отзывы')).toBeInTheDocument();
    expect(screen.getByText(/4\.5 · 2 отзыва/)).toBeInTheDocument();
    expect(screen.getByText('Показать все')).toBeInTheDocument();
  });

  it('shows "Оставить отзыв" button when no reviews', async () => {
    mockProductHook = { ...mockProductHook, data: { ...baseProduct, reviews: [] } };
    await renderPage();
    expect(screen.getByText('Оставить отзыв')).toBeInTheDocument();
  });

  it('opens ReviewModal when "Показать все" is clicked', async () => {
    await renderPage();
    expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Показать все'));
    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
  });

  it('renders add to cart button and calls addItem on click', async () => {
    await renderPage();
    const button = screen.getByText('В корзину');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockAddItem).toHaveBeenCalledTimes(1);
  });

  it('shows added state after clicking add to cart', async () => {
    await renderPage();
    fireEvent.click(screen.getByText('В корзину'));
    expect(screen.getByText('В корзине')).toBeInTheDocument();
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
  });

  it('renders tags', async () => {
    await renderPage();
    expect(screen.getByText('Новинка')).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    await renderPage();
    expect(screen.getByText('Каталог')).toBeInTheDocument();
  });

  it('renders product description', async () => {
    await renderPage();
    expect(screen.getByText('Описание товара')).toBeInTheDocument();
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
