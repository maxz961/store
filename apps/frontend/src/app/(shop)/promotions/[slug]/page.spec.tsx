import { render, screen } from '@testing-library/react';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'nav.home': 'Home',
        'promotions.title': 'Promotions',
        'promotions.noProducts': 'No products found',
        'promotions.noProductsText': 'This promotion has no products yet',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'summer-sale' }),
}));

jest.mock('lucide-react', () => ({
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: false }),
}));

jest.mock('@/lib/hooks/useFavorites', () => ({
  useFavoriteIds: () => ({ data: [] }),
  useAddFavorite: () => ({ mutate: jest.fn() }),
  useRemoveFavorite: () => ({ mutate: jest.fn() }),
}));

jest.mock('@/store/cart', () => ({
  useCartStore: (selector?: (state: any) => any) => {
    const state = { addItem: jest.fn() };
    return selector ? selector(state) : state;
  },
}));

jest.mock('@/components/product/ProductCard', () => ({
  ProductCard: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}));

let mockPromotion: any;
let mockIsLoading: boolean;

jest.mock('@/lib/hooks/usePromotions', () => ({
  usePublicPromotion: () => ({ data: mockPromotion, isLoading: mockIsLoading }),
}));

import PromotionPage from './page';


const mockProduct = {
  id: 'p1',
  name: 'Test Product',
  nameEn: 'Test Product',
  slug: 'test-product',
  price: 199,
  comparePrice: null,
  images: [],
  stock: 5,
  description: 'Desc',
  descriptionEn: 'Desc',
  reviews: [],
  tags: [],
  category: { name: 'Cat', nameEn: 'Cat', slug: 'cat' },
};

const mockPromotionData = {
  id: 'promo-1',
  title: 'Summer Sale',
  titleEn: 'Summer Sale EN',
  description: 'Big discounts this summer',
  descriptionEn: 'Big discounts this summer EN',
  bannerBgColor: '#f1f5f9',
  discountType: 'PERCENTAGE' as const,
  discountValue: 20,
  products: [{ product: mockProduct }],
};


describe('PromotionPage', () => {
  beforeEach(() => {
    mockPromotion = { ...mockPromotionData };
    mockIsLoading = false;
  });

  it('renders without crashing', () => {
    render(<PromotionPage />);
  });

  it('renders breadcrumbs with home', () => {
    render(<PromotionPage />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Promotions')).not.toBeInTheDocument();
  });

  it('renders promotion title', () => {
    render(<PromotionPage />);
    expect(screen.getAllByText('Summer Sale EN').length).toBeGreaterThanOrEqual(1);
  });

  it('renders discount badge', () => {
    render(<PromotionPage />);
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('renders product list', () => {
    render(<PromotionPage />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders spinner in loading state', () => {
    mockIsLoading = true;
    mockPromotion = undefined;
    render(<PromotionPage />);
    expect(screen.queryByText('Summer Sale')).not.toBeInTheDocument();
  });

  it('renders empty state when no products', () => {
    mockPromotion = { ...mockPromotionData, products: [] };
    render(<PromotionPage />);
    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText('This promotion has no products yet')).toBeInTheDocument();
  });

  it('renders promotion description', () => {
    render(<PromotionPage />);
    expect(screen.getByText('Big discounts this summer EN')).toBeInTheDocument();
  });
});
