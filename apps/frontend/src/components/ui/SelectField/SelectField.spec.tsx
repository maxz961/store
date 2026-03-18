import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectField } from './SelectField';


jest.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-chevron-down" {...props} />,
}));

const options = [
  { value: 'price_asc', label: 'Сначала дешёвые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
];

describe('SelectField', () => {
  it('renders label and trigger', () => {
    render(<SelectField label="Сортировка" options={options} />);
    expect(screen.getByText('Сортировка')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сортировка' })).toBeInTheDocument();
  });

  it('shows placeholder when no value selected', () => {
    render(<SelectField label="Сортировка" options={options} placeholder="По умолчанию" />);
    expect(screen.getByRole('button', { name: 'Сортировка' })).toHaveTextContent('По умолчанию');
  });

  it('shows selected option label as trigger text', () => {
    render(
      <SelectField label="Сортировка" options={options} value="price_asc" placeholder="По умолчанию" />,
    );
    expect(screen.getByRole('button', { name: 'Сортировка' })).toHaveTextContent('Сначала дешёвые');
  });

  it('opens dropdown on trigger click', async () => {
    const user = userEvent.setup();
    render(<SelectField label="Сортировка" options={options} placeholder="По умолчанию" />);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Сортировка' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes dropdown after selecting an option', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <SelectField
        label="Сортировка"
        options={options}
        placeholder="По умолчанию"
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Сортировка' }));
    await user.click(screen.getByRole('option', { name: 'Сначала дешёвые' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange with selected value', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <SelectField
        label="Сортировка"
        options={options}
        placeholder="По умолчанию"
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Сортировка' }));
    await user.click(screen.getByRole('option', { name: 'Сначала дорогие' }));

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: 'price_desc' }) }),
    );
  });

  it('calls onChange with empty string when placeholder option selected', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <SelectField
        label="Сортировка"
        options={options}
        value="price_asc"
        placeholder="По умолчанию"
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Сортировка' }));
    await user.click(screen.getByRole('option', { name: 'По умолчанию' }));

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: '' }) }),
    );
  });

  it('marks active option with aria-selected', async () => {
    const user = userEvent.setup();
    render(
      <SelectField label="Сортировка" options={options} value="price_asc" placeholder="По умолчанию" />,
    );

    await user.click(screen.getByRole('button', { name: 'Сортировка' }));

    expect(screen.getByRole('option', { name: 'Сначала дешёвые' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Сначала дорогие' })).toHaveAttribute('aria-selected', 'false');
  });

  it('shows error message', () => {
    render(<SelectField label="Категория" options={options} error="Обязательное поле" />);
    expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
  });

  it('does not render label element when label is empty string', () => {
    const { container } = render(<SelectField label="" options={options} value="price_asc" />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });
});
