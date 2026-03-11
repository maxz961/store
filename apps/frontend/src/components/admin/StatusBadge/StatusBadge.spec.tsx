import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';


describe('StatusBadge', () => {
  it('renders Russian label for PENDING', () => {
    render(<StatusBadge status="PENDING" />);
    expect(screen.getByText('Ожидает')).toBeInTheDocument();
  });

  it('renders Russian label for DELIVERED', () => {
    render(<StatusBadge status="DELIVERED" />);
    expect(screen.getByText('Доставлен')).toBeInTheDocument();
  });

  it('renders Russian label for CANCELLED', () => {
    render(<StatusBadge status="CANCELLED" />);
    expect(screen.getByText('Отменён')).toBeInTheDocument();
  });

  it('renders raw status for unknown value', () => {
    render(<StatusBadge status="CUSTOM" />);
    expect(screen.getByText('CUSTOM')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<StatusBadge status="PENDING" className="extra" />);
    expect(container.firstChild).toHaveClass('extra');
  });

  it('applies correct color classes for each status', () => {
    const { container: c1 } = render(<StatusBadge status="PROCESSING" />);
    expect(c1.firstChild).toHaveClass('bg-blue-50');

    const { container: c2 } = render(<StatusBadge status="SHIPPED" />);
    expect(c2.firstChild).toHaveClass('bg-purple-50');
  });
});
