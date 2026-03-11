import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminReviewsPage from './page';
import * as useReviewsModule from '@/lib/hooks/useReviews';


jest.mock('lucide-react', () => ({
  Star: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-star" {...props} />,
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-chevron-left" {...props} />,
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-chevron-right" {...props} />,
}));


jest.mock('@/lib/hooks/useReviews', () => ({
  ...jest.requireActual('@/lib/hooks/useReviews'),
  useAdminAllReviews: jest.fn(),
  useAdminDeleteReview: jest.fn(),
}));

jest.mock('@/components/ui/Breadcrumbs', () => ({
  Breadcrumbs: () => <nav data-testid="breadcrumbs" />,
}));

const mockReview = {
  id: 'review-1',
  userId: 'user-1',
  productId: 'product-1',
  rating: 5,
  comment: 'Great product!',
  images: [],
  adminReply: null,
  adminReplyAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  user: { id: 'user-1', name: 'Test User', image: null },
  product: { id: 'product-1', name: 'Test Product', slug: 'test-product' },
};

const mockMutate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useReviewsModule.useAdminDeleteReview as jest.Mock).mockReturnValue({ mutate: mockMutate });
});

describe('AdminReviewsPage', () => {
  it('renders without crashing', () => {
    (useReviewsModule.useAdminAllReviews as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, page: 1, totalPages: 1 },
    });
    render(<AdminReviewsPage />);
    expect(screen.getByText('Отзывы')).toBeInTheDocument();
  });

  it('shows empty state when no reviews', () => {
    (useReviewsModule.useAdminAllReviews as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, page: 1, totalPages: 1 },
    });
    render(<AdminReviewsPage />);
    expect(screen.getByText('Отзывов нет')).toBeInTheDocument();
  });

  it('renders reviews table with data', () => {
    (useReviewsModule.useAdminAllReviews as jest.Mock).mockReturnValue({
      data: { data: [mockReview], total: 1, page: 1, totalPages: 1 },
    });
    render(<AdminReviewsPage />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Great product!')).toBeInTheDocument();
  });

  it('shows sort options', () => {
    (useReviewsModule.useAdminAllReviews as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, page: 1, totalPages: 1 },
    });
    render(<AdminReviewsPage />);
    expect(screen.getByText('Новые')).toBeInTheDocument();
    expect(screen.getByText('Старые')).toBeInTheDocument();
    expect(screen.getByText('Высокий рейтинг')).toBeInTheDocument();
    expect(screen.getByText('Низкий рейтинг')).toBeInTheDocument();
  });

  it('shows pagination when multiple pages', () => {
    (useReviewsModule.useAdminAllReviews as jest.Mock).mockReturnValue({
      data: { data: [mockReview], total: 25, page: 1, totalPages: 2 },
    });
    render(<AdminReviewsPage />);
    expect(screen.getByText(/Всего 25 отзывов/)).toBeInTheDocument();
    expect(screen.getByText('Вперёд')).toBeInTheDocument();
  });

  it('calls delete mutation when delete button clicked', async () => {
    (useReviewsModule.useAdminAllReviews as jest.Mock).mockReturnValue({
      data: { data: [mockReview], total: 1, page: 1, totalPages: 1 },
    });
    render(<AdminReviewsPage />);
    await userEvent.click(screen.getByText('Удалить'));
    expect(mockMutate).toHaveBeenCalledWith({ reviewId: 'review-1', productId: '' });
  });

  it('renders gracefully when data is undefined', () => {
    (useReviewsModule.useAdminAllReviews as jest.Mock).mockReturnValue({ data: undefined });
    render(<AdminReviewsPage />);
    expect(screen.getByText('Отзывов нет')).toBeInTheDocument();
  });
});
