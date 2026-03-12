import { render, screen } from '@testing-library/react';


jest.mock('lucide-react', () => ({
  Plus: (props: any) => <div data-testid="icon-plus" {...props} />,
  Pencil: (props: any) => <div data-testid="icon-pencil" {...props} />,
  ChevronRight: (props: any) => <div data-testid="icon-chevron" {...props} />,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/image', () => {
  const MockImage = (props: any) => <div data-testid="next-image" {...props} />;
  MockImage.displayName = 'MockImage';
  return { __esModule: true, default: MockImage };
});

let mockApiGet: jest.Mock;

jest.mock('@/lib/api', () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
  },
}));

import AdminPromotionsPage from './page';


const mockPromotions = [
  {
    id: 'promo-1',
    title: 'Летняя распродажа',
    slug: 'summer-sale',
    description: 'Скидки до 50%',
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
    title: 'Чёрная пятница',
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


describe('AdminPromotionsPage', () => {
  beforeEach(() => {
    mockApiGet = jest.fn().mockResolvedValue(mockPromotions);
  });

  it('renders add promotion button', async () => {
    const jsx = await AdminPromotionsPage();
    render(jsx);
    expect(screen.getByText('Добавить акцию')).toBeInTheDocument();
  });

  it('renders promotion titles from mock data', async () => {
    const jsx = await AdminPromotionsPage();
    render(jsx);
    expect(screen.getByText('Летняя распродажа')).toBeInTheDocument();
    expect(screen.getByText('Чёрная пятница')).toBeInTheDocument();
  });

  it('renders discount values', async () => {
    const jsx = await AdminPromotionsPage();
    render(jsx);
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('500$')).toBeInTheDocument();
  });

  it('renders active/inactive status badges', async () => {
    const jsx = await AdminPromotionsPage();
    render(jsx);
    expect(screen.getByText('Активна')).toBeInTheDocument();
    expect(screen.getByText('Неактивна')).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    const jsx = await AdminPromotionsPage();
    render(jsx);
    expect(screen.getByText('Админ-панель')).toBeInTheDocument();
  });

  it('passes server: true for cookie forwarding', async () => {
    await AdminPromotionsPage();
    expect(mockApiGet).toHaveBeenCalledWith(
      '/promotions',
      expect.objectContaining({ server: true }),
    );
  });

  it('shows empty message when no promotions', async () => {
    mockApiGet = jest.fn().mockResolvedValue([]);
    const jsx = await AdminPromotionsPage();
    render(jsx);
    expect(screen.getByText('Акции не найдены')).toBeInTheDocument();
  });

  it('renders date period', async () => {
    const jsx = await AdminPromotionsPage();
    render(jsx);
    const periodCells = screen.getAllByText(/—/);
    expect(periodCells.length).toBeGreaterThanOrEqual(2);
  });
});
