import { render, screen, fireEvent } from '@testing-library/react';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: jest.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'nav.home': 'Home',
        'nav.catalog': 'Catalog',
        'nav.cart': 'Cart',
        'cart.title': 'Cart',
        'cart.empty': 'Your cart is empty',
        'cart.emptyText': 'Add something from the catalog',
        'cart.browseCatalog': 'Go to catalog',
        'cart.total': 'Total',
        'cart.subtotal': 'Subtotal',
        'cart.items': 'items',
        'cart.checkout': 'Checkout',
        'cart.clear': 'Clear cart',
        'cart.remove': 'Remove item',
        'product.noPhoto': 'No photo',
        'product.pieces': 'pcs.',
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
  getLocalizedText: (_lang: string, uk: string, en?: string | null) => en ?? uk,
}));

jest.mock('lucide-react', () => ({
  Minus: (props: any) => <div data-testid="icon-minus" {...props} />,
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  Trash2: (props: any) => <div data-testid="icon-trash" {...props} />,
  ShoppingBag: (props: any) => <div data-testid="icon-bag" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

import CartPage from './page';


const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClearCart = jest.fn();

let mockCartState: any;

jest.mock('@/store/cart', () => ({
  useCartStore: (selector?: (state: any) => any) =>
    selector ? selector(mockCartState) : mockCartState,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: any) => <img {...props} />,
}));

describe('CartPage', () => {
  beforeEach(() => {
    mockRemoveItem.mockClear();
    mockUpdateQuantity.mockClear();
    mockClearCart.mockClear();

    mockCartState = {
      items: [
        { id: 'p1', name: 'Наушники', price: 149.99, imageUrl: 'https://example.com/img.jpg', quantity: 3, slug: 'headphones', stock: 10 },
      ],
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      totalPrice: () => 449.97,
      totalItems: () => 3,
      clearCart: mockClearCart,
      hydrated: true,
    };
  });

  it('renders cart title', () => {
    render(<CartPage />);
    expect(screen.getByRole('heading', { name: 'Cart' })).toBeInTheDocument();
  });

  it('renders cart item name and unit price', () => {
    render(<CartPage />);
    expect(screen.getByText('Наушники')).toBeInTheDocument();
    expect(screen.getByText('149,99 ₴')).toBeInTheDocument();
  });

  it('renders summary total and item count', () => {
    render(<CartPage />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('3 pcs.')).toBeInTheDocument();
  });

  it('shows empty state when cart is empty', () => {
    mockCartState = { ...mockCartState, items: [] };
    render(<CartPage />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add something from the catalog')).toBeInTheDocument();
    expect(screen.getByText('Go to catalog')).toBeInTheDocument();
  });

  it('calls removeItem on remove button click', () => {
    render(<CartPage />);
    fireEvent.click(screen.getByLabelText('Remove item'));
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');
  });

  it('calls clearCart on clear button click', () => {
    render(<CartPage />);
    fireEvent.click(screen.getByText('Clear cart'));
    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  it('renders checkout button', () => {
    render(<CartPage />);
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(<CartPage />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
  });

  it('renders Subtotal with total price', () => {
    render(<CartPage />);
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getAllByText('449,97 ₴').length).toBeGreaterThanOrEqual(1);
  });

  it('breadcrumbs use i18n keys, not hardcoded English', () => {
    render(<CartPage />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
  });

  it('shows nameEn when language is English (regression: cart was always showing Ukrainian name)', () => {
    mockCartState = {
      ...mockCartState,
      items: [
        { id: 'p1', name: 'Навушники', nameEn: 'Headphones', price: 149.99, imageUrl: '', quantity: 1, slug: 'headphones', stock: 10 },
      ],
    };
    render(<CartPage />);
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.queryByText('Навушники')).not.toBeInTheDocument();
  });
});
