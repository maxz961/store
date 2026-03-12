import { render, screen, fireEvent } from '@testing-library/react';
import { AdminPagination } from './AdminPagination';


jest.mock('lucide-react', () => ({
  ChevronLeft: () => <svg data-testid="chevron-left" />,
  ChevronRight: () => <svg data-testid="chevron-right" />,
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams('status=PENDING'),
}));

const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', { value: mockScrollTo, writable: true });


describe('AdminPagination', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders total info and page numbers', () => {
    render(<AdminPagination page={1} totalPages={3} total={50} itemLabel="заказов" />);
    expect(screen.getByText(/Всего 50 заказов/)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('disables "Назад" on first page', () => {
    render(<AdminPagination page={1} totalPages={3} total={50} itemLabel="заказов" />);
    expect(screen.getByLabelText('Предыдущая страница')).toBeDisabled();
  });

  it('disables "Вперёд" on last page', () => {
    render(<AdminPagination page={3} totalPages={3} total={50} itemLabel="заказов" />);
    expect(screen.getByLabelText('Следующая страница')).toBeDisabled();
  });

  it('preserves existing search params when navigating', () => {
    render(<AdminPagination page={1} totalPages={3} total={50} itemLabel="заказов" />);
    fireEvent.click(screen.getByText('2'));
    expect(mockPush).toHaveBeenCalledWith('?status=PENDING&page=2');
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('shows ellipsis for large page counts', () => {
    render(<AdminPagination page={5} totalPages={10} total={100} itemLabel="товаров" />);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });
});
