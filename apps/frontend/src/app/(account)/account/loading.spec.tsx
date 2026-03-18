import { render } from '@testing-library/react';


jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

import AccountLoading from './loading';


describe('AccountLoading', () => {
  it('renders spinner without crashing', () => {
    const { getByTestId } = render(<AccountLoading />);
    expect(getByTestId('spinner')).toBeInTheDocument();
  });
});
