import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('lucide-react', () => ({
  ChevronLeft: (props: any) => <div data-testid="icon-chevron-left" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron-right" {...props} />,
}));

jest.mock('next/image', () => {
  const MockImage = (props: any) => <img {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return { __esModule: true, default: MockLink };
});

let mockApiGet: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
  },
}));

import { PromoBanner } from './PromoBanner';


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

const renderBanner = () => render(<PromoBanner />, { wrapper: createWrapper() });

const mockPromotions = [
  {
    id: 'promo-1',
    title: 'Весенняя распродажа',
    slug: 'spring-sale',
    description: 'Скидки на все',
    bannerImageUrl: 'https://example.com/banner1.jpg',
    bannerBgColor: '#e8f5e9',
    discountType: 'PERCENTAGE',
    discountValue: 25,
    link: '/products?tagSlugs=sale',
  },
  {
    id: 'promo-2',
    title: 'Новинки сезона',
    slug: 'new-season',
    description: null,
    bannerImageUrl: 'https://example.com/banner2.jpg',
    bannerBgColor: '#e3f2fd',
    discountType: 'FIXED',
    discountValue: 50,
    link: null,
  },
];


describe('PromoBanner', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockPromotions);
  });

  it('renders nothing when no promotions', () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    const { container } = renderBanner();
    expect(container.firstChild).toBeNull();
  });

  it('renders promotion title', async () => {
    renderBanner();
    expect(await screen.findByText('Весенняя распродажа')).toBeInTheDocument();
  });

  it('renders discount value as percentage', async () => {
    renderBanner();
    expect(await screen.findByText('-25%')).toBeInTheDocument();
  });

  it('renders discount value as fixed amount', async () => {
    renderBanner();
    expect(await screen.findByText('-$50')).toBeInTheDocument();
  });

  it('renders "Подробнее" link when link is provided', async () => {
    renderBanner();
    const link = await screen.findByText('Подробнее');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/products?tagSlugs=sale');
  });

  it('renders navigation arrows when multiple promotions', async () => {
    renderBanner();
    await screen.findByText('Весенняя распродажа');
    expect(screen.getByLabelText('Предыдущий баннер')).toBeInTheDocument();
    expect(screen.getByLabelText('Следующий баннер')).toBeInTheDocument();
  });

  it('does not render arrows when single promotion', async () => {
    mockApiGet = jest.fn().mockResolvedValue([mockPromotions[0]]);
    renderBanner();
    await screen.findByText('Весенняя распродажа');
    expect(screen.queryByLabelText('Предыдущий баннер')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Следующий баннер')).not.toBeInTheDocument();
  });

  it('renders dots for multiple promotions', async () => {
    renderBanner();
    await screen.findByText('Весенняя распродажа');
    expect(screen.getByLabelText('Баннер 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Баннер 2')).toBeInTheDocument();
  });

  it('clicking next arrow changes slide', async () => {
    renderBanner();
    await screen.findByText('Весенняя распродажа');

    const track = screen.getByText('Весенняя распродажа').closest('[class*="flex"]')!.parentElement!;
    expect(track).toHaveStyle({ transform: 'translateX(-0%)' });

    fireEvent.click(screen.getByLabelText('Следующий баннер'));
    expect(track).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('clicking dot changes slide', async () => {
    renderBanner();
    await screen.findByText('Весенняя распродажа');

    const track = screen.getByText('Весенняя распродажа').closest('[class*="flex"]')!.parentElement!;

    fireEvent.click(screen.getByLabelText('Баннер 2'));
    expect(track).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('handles empty promotions array gracefully', () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    const { container } = renderBanner();
    expect(container.innerHTML).toBe('');
  });
});
