import { render, screen } from '@testing-library/react';
import { StatsCard } from './StatsCard';


describe('StatsCard', () => {
  it('renders label and value', () => {
    render(<StatsCard label="Выручка" value="1 000 ₴" icon={<span data-testid="icon" />} />);
    expect(screen.getByText('Выручка')).toBeInTheDocument();
    expect(screen.getByText('1 000 ₴')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatsCard label="Заказы" value={42} subtitle="за месяц" icon={<span />} />);
    expect(screen.getByText('за месяц')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<StatsCard label="Заказы" value={42} icon={<span />} />);
    expect(screen.queryByText('за месяц')).not.toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<StatsCard label="Тест" value={0} icon={<span data-testid="test-icon" />} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<StatsCard label="Кол-во" value={100} icon={<span />} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
