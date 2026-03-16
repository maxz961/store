import { render, screen, fireEvent } from '@testing-library/react';
import type { Product } from './page.types';


jest.mock('lucide-react', () => ({
  Pencil: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-pencil" {...props} />,
}));

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, onError, ...rest }: {
    src: string;
    alt: string;
    onError?: () => void;
  } & Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="mock-image" src={src} alt={alt} onError={onError} {...rest} />
  );
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

jest.mock('next/link', () => {
  const MockLink = ({ children, href, onClick, ...rest }: {
    children: React.ReactNode;
    href: string;
    onClick?: (e: React.MouseEvent) => void;
  } & Record<string, unknown>) => (
    <a href={href} onClick={onClick} data-testid="edit-link" {...rest}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return { __esModule: true, default: MockLink };
});

const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

jest.mock('@/lib/api', () => ({
  api: { patch: jest.fn().mockResolvedValue({}) },
}));

jest.mock('@/lib/constants/format', () => ({
  formatCurrency: (v: number) => `${v} ₴`,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span data-testid="badge">{children}</span>,
}));

jest.mock('react-if', () => ({
  If: ({ condition, children }: { condition: boolean; children: React.ReactNode[] }) => {
    const arr = Array.isArray(children) ? children : [children];
    return condition ? arr[0] : (arr[1] ?? null);
  },
  Then: ({ children }: { children: React.ReactNode }) => children,
  Else: ({ children }: { children: React.ReactNode }) => children,
  When: ({ condition, children }: { condition: boolean; children: React.ReactNode }) =>
    condition ? children : null,
}));

import { ProductRow } from './ProductRow';


const baseProduct: Product = {
  id: 'p1',
  name: 'Наушники Sony',
  slug: 'sony-headphones',
  price: 9999,
  stock: 25,
  isPublished: true,
  images: ['https://example.com/img.jpg'],
  category: { name: 'Электроника' },
  tags: [{ tag: { slug: 'wireless', name: 'Беспроводные' } }],
};


describe('ProductRow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders product name', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    expect(screen.getByText('Наушники Sony')).toBeInTheDocument();
  });

  it('renders category', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    expect(screen.getByText('Электроника')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    expect(screen.getByText('Беспроводные')).toBeInTheDocument();
  });

  it('renders price formatted', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    expect(screen.getByText('9999 ₴')).toBeInTheDocument();
  });

  it('shows published status', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('shows draft status when not published', () => {
    const product = { ...baseProduct, isPublished: false };
    render(<table><tbody><ProductRow product={product} /></tbody></table>);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('shows dash when no category', () => {
    const product = { ...baseProduct, category: null };
    render(<table><tbody><ProductRow product={product} /></tbody></table>);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders product image when images exist', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
  });

  it('shows fallback when images array is empty', () => {
    const product = { ...baseProduct, images: [] };
    render(<table><tbody><ProductRow product={product} /></tbody></table>);
    expect(screen.queryByTestId('mock-image')).not.toBeInTheDocument();
  });

  it('shows fallback when image fails to load', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    fireEvent.error(screen.getByTestId('mock-image'));
    expect(screen.queryByTestId('mock-image')).not.toBeInTheDocument();
  });

  it('edit link points to admin edit page', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    const link = screen.getByTestId('edit-link');
    expect(link.getAttribute('href')).toBe('/admin/products/sony-headphones');
  });

  it('edit link click does not bubble to row click', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    const link = screen.getByTestId('edit-link');
    fireEvent.click(link);
    expect(mockRouterPush).not.toHaveBeenCalledWith('/products/sony-headphones');
  });

  it('row click navigates to shop product page', () => {
    render(<table><tbody><ProductRow product={baseProduct} /></tbody></table>);
    fireEvent.click(screen.getByText('Наушники Sony'));
    expect(mockRouterPush).toHaveBeenCalledWith('/products/sony-headphones');
  });

  it('shows low stock style when stock <= 5', () => {
    const product = { ...baseProduct, stock: 3 };
    render(<table><tbody><ProductRow product={product} /></tbody></table>);
    const stockEl = screen.getByText('3');
    expect(stockEl.className).toContain('text-destructive');
  });
});
