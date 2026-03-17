import { render, screen } from '@testing-library/react';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    lang: 'en',
    t: (k: string) => {
      const map: Record<string, string> = {
        'review.loginToReview': 'Log in',
        'review.loginToReviewSuffix': 'to leave a review',
        'product.writeReview': 'Write a review',
        'review.editTitle': 'Edit review',
        'review.rating': 'Rating',
        'review.commentPlaceholder': 'Tell us about the product...',
        'review.photosLabel': 'Photos (optional)',
        'review.submitting': 'Submitting...',
        'review.submitError': 'Failed to submit the review',
        'review.selectRating': 'Select a rating',
        'common.save': 'Save',
      };
      return map[k] ?? k;
    },
  }),
}));

jest.mock('lucide-react', () => ({}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return { __esModule: true, default: MockLink };
});

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/hooks/useReviews', () => ({
  useCreateReview: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useUpdateReview: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useUploadReviewImages: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock('@/components/ui/StarRating', () => ({
  StarRating: ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div data-testid="star-rating" onClick={() => onChange(5)}>{value}</div>
  ),
}));

jest.mock('@/components/ui/ImageUpload', () => ({
  ImageUpload: () => <div data-testid="image-upload" />,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, type, ...props }: {
    children: React.ReactNode;
    disabled?: boolean;
    type?: string;
  } & Record<string, unknown>) => (
    <button disabled={disabled} type={type as 'button' | 'submit' | 'reset'} {...props}>
      {children}
    </button>
  ),
}));

import * as useAuthModule from '@/lib/hooks/useAuth';
import { ReviewForm } from './ReviewForm';


describe('ReviewForm', () => {
  const defaultProps = {
    productId: 'p1',
    productSlug: 'test-product',
  };

  it('shows login prompt when not authenticated', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText(/to leave a review/)).toBeInTheDocument();
  });

  it('renders review form title when authenticated', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(<ReviewForm {...defaultProps} />);
    // Both title <p> and submit button contain this text
    expect(screen.getAllByText('Write a review').length).toBeGreaterThan(0);
  });

  it('shows "Сохранить" button when editing existing review', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    const existingReview = {
      id: 'r1', rating: 4, comment: 'Хорошо', images: [],
      userId: 'u1', productId: 'p1', adminReply: null, adminReplyAt: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      user: { id: 'u1', name: 'Test', image: null },
    };
    render(<ReviewForm {...defaultProps} existingReview={existingReview} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders textarea for comment', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Tell us about the product...')).toBeInTheDocument();
  });

  it('submit button is right-aligned (justify-end on actions)', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(<ReviewForm {...defaultProps} />);
    const btn = screen.getByRole('button', { name: 'Write a review' });
    const actionsDiv = btn?.parentElement;
    expect(actionsDiv?.className).toContain('justify-end');
  });

  it('renders star rating field', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByTestId('star-rating')).toBeInTheDocument();
  });

  it('renders image upload field', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByTestId('image-upload')).toBeInTheDocument();
  });
});
