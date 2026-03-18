import { render, screen, fireEvent } from '@testing-library/react';
import type { Review } from '@/lib/hooks/useReviews';


jest.mock('lucide-react', () => ({
  Trash2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-trash" {...props} />,
  MessageSquare: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-message" {...props} />,
  Pencil: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-pencil" {...props} />,
}));

jest.mock('next/image', () => {
  const MockImage = (props: Record<string, unknown>) => {
    const { src, alt, fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img data-testid="mock-image" src={src as string} alt={alt as string} data-fill={fill ? 'true' : undefined} {...rest} />;
  };
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isAdmin: false }),
}));

jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'uk',
    t: (k: string) => {
      const map: Record<string, string> = {
        'review.shopReply': 'Ответ магазина',
        'review.replyPlaceholder': 'Ответ от имени магазина...',
        'review.reply': 'Ответить',
        'review.anonymous': 'Аноним',
        'common.cancel': 'Отмена',
      };
      return map[k] ?? k;
    },
  }),
}));

jest.mock('@/lib/utils', () => ({
  getInitials: (name: string | null) => name?.slice(0, 2).toUpperCase() ?? '??',
  langToLocale: () => 'uk-UA',
}));

jest.mock('@/components/ui/StarRating', () => ({
  StarRating: ({ value }: { value: number }) => <span data-testid="star-rating">{value}</span>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, ...props }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
  } & Record<string, unknown>) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} {...props}>
      {children}
    </button>
  ),
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

import { ReviewCard } from './ReviewCard';


const baseReview: Review = {
  id: 'r1',
  userId: 'u1',
  productId: 'p1',
  rating: 4,
  comment: 'Хороший товар',
  images: [],
  adminReply: null,
  adminReplyAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  user: { id: 'u1', name: 'Иван Иванов', image: null },
};

const onImageClick = jest.fn();


describe('ReviewCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} />);
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
  });

  it('renders comment', () => {
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} />);
    expect(screen.getByText('Хороший товар')).toBeInTheDocument();
  });

  it('renders star rating', () => {
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} />);
    expect(screen.getByTestId('star-rating')).toHaveTextContent('4');
  });

  it('shows avatar fallback initials when no image', () => {
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} />);
    expect(screen.getByText('ИВ')).toBeInTheDocument();
  });

  it('shows avatar image when user has image', () => {
    const review = { ...baseReview, user: { ...baseReview.user, image: 'https://example.com/avatar.jpg' } };
    render(<ReviewCard review={review} onImageClick={onImageClick} />);
    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
  });

  it('does not render comment block when comment is null', () => {
    const review = { ...baseReview, comment: null };
    render(<ReviewCard review={review} onImageClick={onImageClick} />);
    expect(screen.queryByText('Хороший товар')).not.toBeInTheDocument();
  });

  it('renders admin reply when present', () => {
    const review = { ...baseReview, adminReply: 'Спасибо за отзыв', adminReplyAt: '2024-01-02T00:00:00.000Z' };
    render(<ReviewCard review={review} onImageClick={onImageClick} />);
    expect(screen.getByText('Спасибо за отзыв')).toBeInTheDocument();
    expect(screen.getByText('Ответ магазина')).toBeInTheDocument();
  });

  it('does not render admin reply block when adminReply is null', () => {
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} />);
    expect(screen.queryByText('Ответ магазина')).not.toBeInTheDocument();
  });

  it('shows reply form when admin clicks reply button', () => {
    jest.spyOn(require('@/lib/hooks/useAuth'), 'useAuth').mockReturnValue({
      user: { id: 'admin-id' },
      isAdmin: true,
    });
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} />);
    fireEvent.click(screen.getByTestId('icon-message').closest('button')!);
    expect(screen.getByPlaceholderText('Ответ от имени магазина...')).toBeInTheDocument();
  });

  it('hides reply form when cancel is clicked', () => {
    jest.spyOn(require('@/lib/hooks/useAuth'), 'useAuth').mockReturnValue({
      user: { id: 'admin-id' },
      isAdmin: true,
    });
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} />);
    fireEvent.click(screen.getByTestId('icon-message').closest('button')!);
    fireEvent.click(screen.getByText('Отмена'));
    expect(screen.queryByPlaceholderText('Ответ от имени магазина...')).not.toBeInTheDocument();
  });

  it('cancel button uses outline variant', () => {
    jest.spyOn(require('@/lib/hooks/useAuth'), 'useAuth').mockReturnValue({
      user: { id: 'admin-id' },
      isAdmin: true,
    });
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} />);
    fireEvent.click(screen.getByTestId('icon-message').closest('button')!);
    const cancelBtn = screen.getByText('Отмена');
    expect(cancelBtn).toHaveAttribute('data-variant', 'outline');
  });

  it('calls onDeleteReview when delete is clicked by own user', () => {
    const onDeleteReview = jest.fn();
    jest.spyOn(require('@/lib/hooks/useAuth'), 'useAuth').mockReturnValue({
      user: { id: 'u1' },
      isAdmin: false,
    });
    render(<ReviewCard review={baseReview} onImageClick={onImageClick} onDeleteReview={onDeleteReview} />);
    fireEvent.click(screen.getByTestId('icon-trash').closest('button')!);
    expect(onDeleteReview).toHaveBeenCalledWith('r1');
  });

  it('does not crash with undefined images', () => {
    const review = { ...baseReview, images: [] };
    expect(() => render(<ReviewCard review={review} onImageClick={onImageClick} />)).not.toThrow();
  });
});
