import { render } from '@testing-library/react';


jest.mock('next-nprogress-bar', () => ({
  AppProgressBar: (props: any) => (
    <div data-testid="progress-bar" data-height={props.height} data-color={props.color} />
  ),
}));

import { NavigationProgress } from './NavigationProgress';


describe('NavigationProgress', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<NavigationProgress />);
    expect(getByTestId('progress-bar')).toBeInTheDocument();
  });

  it('uses primary brand color', () => {
    const { getByTestId } = render(<NavigationProgress />);
    expect(getByTestId('progress-bar')).toHaveAttribute('data-color', '#4361ee');
  });

  it('renders a thin bar (2px)', () => {
    const { getByTestId } = render(<NavigationProgress />);
    expect(getByTestId('progress-bar')).toHaveAttribute('data-height', '2px');
  });
});
