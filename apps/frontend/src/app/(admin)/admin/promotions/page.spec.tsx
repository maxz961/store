import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ lang: 'en', setLang: jest.fn(), t: (key: string) => key }),
}));

jest.mock('lucide-react', () => ({
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  Pencil: (props: any) => <div data-testid="icon-pencil" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/image', () => {
  const MockImage = (props: any) => <div data-testid="next-image" {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

let mockPromotionsData: any[];
let mockIsLoading: boolean;

jest.mock('@/lib/hooks/usePromotions', () => ({
  usePromotions: () => ({
    data: mockPromotionsData,
    isLoading: mockIsLoading,
  }),
}));

import AdminPromotionsPage from './page';


const mockPromotions = [
  {
    id: 'promo-1',
    title: 'Summer Sale',
    slug: 'summer-sale',
    description: 'Up to 50% off',
    bannerImageUrl: 'https://example.com/summer.jpg',
    bannerBgColor: '#ff6600',
    startDate: '2026-06-01T00:00:00.000Z',
    endDate: '2026-06-30T23:59:59.000Z',
    discountType: 'PERCENTAGE' as const,
    discountValue: 20,
    isActive: true,
    position: 1,
    link: null,
  },
  {
    id: 'promo-2',
    title: 'Black Friday',
    slug: 'black-friday',
    description: null,
    bannerImageUrl: 'https://example.com/bf.jpg',
    bannerBgColor: null,
    startDate: '2026-11-25T00:00:00.000Z',
    endDate: '2026-11-28T23:59:59.000Z',
    discountType: 'FIXED' as const,
    discountValue: 500,
    isActive: false,
    position: 2,
    link: '/products?tag=black-friday',
  },
];


const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

const renderPage = () => render(<AdminPromotionsPage />, { wrapper: createWrapper() });


describe('AdminPromotionsPage', () => {
  beforeEach(() => {
    mockPromotionsData = mockPromotions;
    mockIsLoading = false;
  });

  it('renders add promotion button', () => {
    renderPage();
    expect(screen.getByText('New promotion')).toBeInTheDocument();
  });

  it('renders promotion titles from mock data', () => {
    renderPage();
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
    expect(screen.getByText('Black Friday')).toBeInTheDocument();
  });

  it('renders discount values', () => {
    renderPage();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('500$')).toBeInTheDocument();
  });

  it('renders active/inactive status badges', () => {
    renderPage();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Admin panel')).toBeInTheDocument();
    expect(screen.getByText('Promotions')).toBeInTheDocument();
  });

  it('shows empty message when no promotions', () => {
    mockPromotionsData = [];
    renderPage();
    expect(screen.getByText('No promotions found')).toBeInTheDocument();
  });

  it('renders date period', () => {
    renderPage();
    const periodCells = screen.getAllByText(/—/);
    expect(periodCells.length).toBeGreaterThanOrEqual(2);
  });

  it('shows loading spinner when fetching', () => {
    mockIsLoading = true;
    mockPromotionsData = [];
    renderPage();
    expect(screen.queryByText('Summer Sale')).not.toBeInTheDocument();
  });
});
