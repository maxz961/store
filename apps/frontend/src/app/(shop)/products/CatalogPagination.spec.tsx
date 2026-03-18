import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogPagination } from './CatalogPagination';


const mockUpdate = jest.fn();

jest.mock('lucide-react', () => ({
  ChevronLeft: () => <svg data-testid="chevron-left" />,
  ChevronRight: () => <svg data-testid="chevron-right" />,
}));

jest.mock('@/lib/hooks/useProductParams', () => ({
  useProductParams: () => ({ update: mockUpdate }),
}));

const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', { value: mockScrollTo, writable: true });


describe('CatalogPagination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nav buttons and all page numbers when totalPages <= 7', () => {
    render(<CatalogPagination page={1} totalPages={3} />);

    expect(screen.getByText('Назад')).toBeInTheDocument();
    expect(screen.getByText('Вперёд')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('disables "Назад" on first page', () => {
    render(<CatalogPagination page={1} totalPages={3} />);
    expect(screen.getByLabelText('Предыдущая страница')).toBeDisabled();
  });

  it('disables "Вперёд" on last page', () => {
    render(<CatalogPagination page={3} totalPages={3} />);
    expect(screen.getByLabelText('Следующая страница')).toBeDisabled();
  });

  it('calls update with next page on "Вперёд" click', () => {
    render(<CatalogPagination page={1} totalPages={3} />);
    fireEvent.click(screen.getByLabelText('Следующая страница'));
    expect(mockUpdate).toHaveBeenCalledWith({ page: '2' });
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('calls update with prev page on "Назад" click', () => {
    render(<CatalogPagination page={2} totalPages={3} />);
    fireEvent.click(screen.getByLabelText('Предыдущая страница'));
    expect(mockUpdate).toHaveBeenCalledWith({ page: '1' });
  });

  it('calls update with correct page on page number click', () => {
    render(<CatalogPagination page={1} totalPages={3} />);
    fireEvent.click(screen.getByText('3'));
    expect(mockUpdate).toHaveBeenCalledWith({ page: '3' });
  });

  it('shows ellipsis for large page counts', () => {
    render(<CatalogPagination page={5} totalPages={10} />);
    const dots = screen.getAllByText('…');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('active page has aria-current="page"', () => {
    render(<CatalogPagination page={2} totalPages={3} />);
    const activePage = screen.getByRole('button', { name: '2' });
    expect(activePage).toHaveAttribute('aria-current', 'page');
  });
});
