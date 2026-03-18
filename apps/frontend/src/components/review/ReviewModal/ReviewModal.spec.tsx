import { render, screen, fireEvent } from '@testing-library/react';


jest.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-x" {...props} />,
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-prev" {...props} />,
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-next" {...props} />,
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

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isAdmin: false }),
}));

jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    t: (k: string) => {
      const map: Record<string, string> = {
        'product.reviews': 'Reviews',
        'product.writeReview': 'Write a review',
        'review.sortLabel': 'Sort:',
        'review.sortNewest': 'Newest',
        'review.sortOldest': 'Oldest',
        'review.sortHighest': 'Highest rated',
        'review.sortLowest': 'Lowest rated',
        'review.empty': 'No reviews yet',
      };
      return map[k] ?? k;
    },
  }),
}));

jest.mock('@/lib/hooks/useReviews', () => ({
  useProductReviews: jest.fn(),
  useMyReview: () => ({ data: null }),
  useDeleteReview: () => ({ mutate: jest.fn() }),
  useAdminDeleteReview: () => ({ mutate: jest.fn() }),
  useAdminReply: () => ({ mutate: jest.fn() }),
  useAdminDeleteReply: () => ({ mutate: jest.fn() }),
}));

jest.mock('@/components/review/ReviewForm', () => ({
  ReviewForm: () => <div data-testid="review-form" />,
}));

jest.mock('@/components/review/ReviewCard', () => ({
  ReviewCard: ({ review }: { review: { comment: string } }) => (
    <div data-testid="review-card">{review.comment}</div>
  ),
}));

import * as useReviewsModule from '@/lib/hooks/useReviews';
import { ReviewModal } from './ReviewModal';


const defaultProps = {
  productId: 'p1',
  productSlug: 'test-product',
  onClose: jest.fn(),
};

const makeReview = (id: string) => ({
  id,
  userId: 'u1',
  productId: 'p1',
  rating: 4,
  comment: `Review ${id}`,
  images: [],
  adminReply: null,
  adminReplyAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  user: { id: 'u1', name: 'Test User', image: null },
});


describe('ReviewModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} />);
    expect(screen.getByText(/Reviews/)).toBeInTheDocument();
  });

  it('shows empty state when there are no reviews', () => {
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  it('renders review cards when reviews exist', () => {
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [makeReview('r1'), makeReview('r2')], total: 2, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} />);
    expect(screen.getAllByTestId('review-card')).toHaveLength(2);
  });

  it('shows sort buttons when there is at least 1 review', () => {
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [makeReview('r1')], total: 1, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} />);
    expect(screen.getByText('Newest')).toBeInTheDocument();
    expect(screen.getByText('Oldest')).toBeInTheDocument();
  });

  it('does NOT show sort buttons when there are no reviews', () => {
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} />);
    expect(screen.queryByText('Newest')).not.toBeInTheDocument();
  });

  it('shows all 4 sort options when reviews exist', () => {
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [makeReview('r1')], total: 1, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} />);
    expect(screen.getByText('Newest')).toBeInTheDocument();
    expect(screen.getByText('Oldest')).toBeInTheDocument();
    expect(screen.getByText('Highest rated')).toBeInTheDocument();
    expect(screen.getByText('Lowest rated')).toBeInTheDocument();
  });

  it('hides pagination when only 1 page', () => {
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [makeReview('r1')], total: 1, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} />);
    expect(screen.queryByTestId('icon-prev')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-next')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getAllByTestId('icon-x')[0].closest('button')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows write review button when not authenticated and no existing review', () => {
    (useReviewsModule.useProductReviews as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, totalPages: 1 },
    });
    render(<ReviewModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Write a review' })).toBeInTheDocument();
  });
});
