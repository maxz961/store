import { render, screen, fireEvent } from '@testing-library/react';
import { PriceRangeSlider } from './PriceRangeSlider';


const mockOnChange = jest.fn();

const defaultProps = {
  min: 0,
  max: 1000,
  value: [100, 500] as [number, number],
  onChange: mockOnChange,
};

describe('PriceRangeSlider', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders without crash', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    expect(screen.getByLabelText('Минимальная цена')).toBeInTheDocument();
    expect(screen.getByLabelText('Максимальная цена')).toBeInTheDocument();
  });

  it('displays initial values in inputs', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    expect(screen.getByLabelText('Минимальная цена')).toHaveValue('100');
    expect(screen.getByLabelText('Максимальная цена')).toHaveValue('500');
  });

  it('calls onChange on mouseUp on min slider', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const sliders = screen.getAllByLabelText(/слайдер/);
    fireEvent.mouseUp(sliders[0]);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange on mouseUp on max slider', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const sliders = screen.getAllByLabelText(/слайдер/);
    fireEvent.mouseUp(sliders[1]);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange with correct values on min input blur', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const minInput = screen.getByLabelText('Минимальная цена');
    fireEvent.change(minInput, { target: { value: '200' } });
    fireEvent.blur(minInput);
    expect(mockOnChange).toHaveBeenCalledWith([200, 500]);
  });

  it('calls onChange with correct values on max input blur', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const maxInput = screen.getByLabelText('Максимальная цена');
    fireEvent.change(maxInput, { target: { value: '800' } });
    fireEvent.blur(maxInput);
    expect(mockOnChange).toHaveBeenCalledWith([100, 800]);
  });

  it('clamps min input below site min to site min on blur', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const minInput = screen.getByLabelText('Минимальная цена');
    fireEvent.change(minInput, { target: { value: '0' } });
    fireEvent.blur(minInput);
    expect(mockOnChange).toHaveBeenCalledWith([0, 500]);
    expect(minInput).toHaveValue('0');
  });

  it('clamps max input above site max to site max on blur', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const maxInput = screen.getByLabelText('Максимальная цена');
    fireEvent.change(maxInput, { target: { value: '9999999' } });
    fireEvent.blur(maxInput);
    expect(mockOnChange).toHaveBeenCalledWith([100, 1000]);
    expect(maxInput).toHaveValue('1000');
  });

  it('filters out non-numeric characters in min input', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const minInput = screen.getByLabelText('Минимальная цена');
    fireEvent.change(minInput, { target: { value: 'abc123def' } });
    expect(minInput).toHaveValue('123');
  });

  it('filters out non-numeric characters in max input', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const maxInput = screen.getByLabelText('Максимальная цена');
    fireEvent.change(maxInput, { target: { value: '!@#400$%' } });
    expect(maxInput).toHaveValue('400');
  });

  it('syncs local state when props change (external reset)', () => {
    const { rerender } = render(<PriceRangeSlider {...defaultProps} />);
    rerender(<PriceRangeSlider {...defaultProps} value={[0, 1000]} />);
    expect(screen.getByLabelText('Минимальная цена')).toHaveValue('0');
    expect(screen.getByLabelText('Максимальная цена')).toHaveValue('1000');
  });
});
