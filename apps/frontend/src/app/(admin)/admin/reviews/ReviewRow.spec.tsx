import { render, screen, fireEvent } from '@testing-library/react';
import type { AdminReview } from '@/lib/hooks/useReviews';


jest.mock('lucide-react', () => ({
  Star: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-star" {...props} />,
}));

jest.mock('next/image', () => {
  const MockImage = (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img data-testid="mock-image" src={src as string} alt={alt as string} {...rest} />;
  };
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

jest.mock('next/link', () => {
  const MockLink = ({ children, href, prefetch, ...rest }: {
    children: React.ReactNode;
    href: string;
    prefetch?: boolean;
  } & Record<string, unknown>) => (
    <a href={href} data-prefetch={prefetch === false ? 'false' : undefined} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return { __esModule: true, default: MockLink };
});

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

jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ lang: 'uk', t: (k: string) => k }),
}));

jest.mock('@/lib/utils', () => ({
  getInitials: (name: string | null) => name?.slice(0, 2).toUpperCase() ?? '??',
  langToLocale: () => 'uk-UA',
}));

import { ReviewRow } from './ReviewRow';


const baseReview: AdminReview = {
  id: 'r1',
  userId: 'u1',
  productId: 'p1',
  rating: 4,
  comment: 'Хороший товар',
  images: [],
  adminReply: null,
  adminReplyAt: null,
  createdAt: '2024-01-15T00:00:00.000Z',
  user: { id: 'u1', name: 'Иван Иванов', image: null },
  product: { id: 'p1', name: 'Наушники Sony', slug: 'sony-headphones' },
};

const onDelete = jest.fn();


describe('ReviewRow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    render(<table><tbody><ReviewRow review={baseReview} onDelete={onDelete} /></tbody></table>);
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
  });

  it('renders product name with link', () => {
    render(<table><tbody><ReviewRow review={baseReview} onDelete={onDelete} /></tbody></table>);
    const link = screen.getByRole('link', { name: 'Наушники Sony' });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/products/sony-headphones?reviews=open');
  });

  it('product link has prefetch disabled', () => {
    render(<table><tbody><ReviewRow review={baseReview} onDelete={onDelete} /></tbody></table>);
    const link = screen.getByRole('link', { name: 'Наушники Sony' });
    expect(link).toHaveAttribute('data-prefetch', 'false');
  });

  it('renders comment when present', () => {
    render(<table><tbody><ReviewRow review={baseReview} onDelete={onDelete} /></tbody></table>);
    expect(screen.getByText('Хороший товар')).toBeInTheDocument();
  });

  it('shows "Без комментария" when comment is null', () => {
    const review = { ...baseReview, comment: null };
    render(<table><tbody><ReviewRow review={review} onDelete={onDelete} /></tbody></table>);
    expect(screen.getByText('Без комментария')).toBeInTheDocument();
  });

  it('shows "Есть ответ" badge when adminReply is set', () => {
    const review = { ...baseReview, adminReply: 'Спасибо!' };
    render(<table><tbody><ReviewRow review={review} onDelete={onDelete} /></tbody></table>);
    expect(screen.getByText('Есть ответ')).toBeInTheDocument();
  });

  it('does not show "Есть ответ" when no adminReply', () => {
    render(<table><tbody><ReviewRow review={baseReview} onDelete={onDelete} /></tbody></table>);
    expect(screen.queryByText('Есть ответ')).not.toBeInTheDocument();
  });

  it('calls onDelete with review id when delete button clicked', () => {
    render(<table><tbody><ReviewRow review={baseReview} onDelete={onDelete} /></tbody></table>);
    fireEvent.click(screen.getByText('Удалить'));
    expect(onDelete).toHaveBeenCalledWith('r1');
  });

  it('shows avatar fallback when user has no image', () => {
    render(<table><tbody><ReviewRow review={baseReview} onDelete={onDelete} /></tbody></table>);
    expect(screen.getByText('ИВ')).toBeInTheDocument();
  });

  it('shows avatar image when user has image', () => {
    const review = { ...baseReview, user: { ...baseReview.user, image: 'https://example.com/avatar.jpg' } };
    render(<table><tbody><ReviewRow review={review} onDelete={onDelete} /></tbody></table>);
    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
  });

  it('renders 5 star icons', () => {
    render(<table><tbody><ReviewRow review={baseReview} onDelete={onDelete} /></tbody></table>);
    expect(screen.getAllByTestId('icon-star')).toHaveLength(5);
  });
});
