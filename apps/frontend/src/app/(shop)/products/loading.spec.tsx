import { render } from '@testing-library/react';


jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

import ProductsLoading from './loading';


describe('ProductsLoading', () => {
  it('renders spinner without crashing', () => {
    const { getByTestId } = render(<ProductsLoading />);
    expect(getByTestId('spinner')).toBeInTheDocument();
  });
});
