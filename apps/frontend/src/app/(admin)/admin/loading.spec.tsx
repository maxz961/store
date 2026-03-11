import { render } from '@testing-library/react';


jest.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

import AdminLoading from './loading';


describe('AdminLoading', () => {
  it('renders spinner without crashing', () => {
    const { getByTestId } = render(<AdminLoading />);
    expect(getByTestId('spinner')).toBeInTheDocument();
  });
});
