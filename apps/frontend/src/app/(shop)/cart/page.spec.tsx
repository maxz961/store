import { render, screen, fireEvent } from '@testing-library/react';


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
    expect(screen.getByRole('heading', { name: 'Корзина' })).toBeInTheDocument();
  });

  it('renders cart item name and unit price', () => {
    render(<CartPage />);
    expect(screen.getByText('Наушники')).toBeInTheDocument();
    expect(screen.getByText('149,99 ₴')).toBeInTheDocument();
  });

  it('renders summary total and item count', () => {
    render(<CartPage />);
    expect(screen.getByText('Итого')).toBeInTheDocument();
    expect(screen.getByText('3 шт.')).toBeInTheDocument();
  });

  it('shows empty state when cart is empty', () => {
    mockCartState = { ...mockCartState, items: [] };
    render(<CartPage />);
    expect(screen.getByText('Корзина пуста')).toBeInTheDocument();
    expect(screen.getByText('Добавьте товары из каталога')).toBeInTheDocument();
    expect(screen.getByText('Перейти в каталог')).toBeInTheDocument();
  });

  it('calls removeItem on remove button click', () => {
    render(<CartPage />);
    fireEvent.click(screen.getByLabelText('Удалить товар'));
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');
  });

  it('calls clearCart on clear button click', () => {
    render(<CartPage />);
    fireEvent.click(screen.getByText('Очистить корзину'));
    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  it('renders checkout button', () => {
    render(<CartPage />);
    expect(screen.getByText('Оформить заказ')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(<CartPage />);
    expect(screen.getByText('Каталог')).toBeInTheDocument();
  });

  it('renders Сумма with total price', () => {
    render(<CartPage />);
    expect(screen.getByText('Сумма')).toBeInTheDocument();
    expect(screen.getAllByText('449,97 ₴').length).toBeGreaterThanOrEqual(1);
  });
});
