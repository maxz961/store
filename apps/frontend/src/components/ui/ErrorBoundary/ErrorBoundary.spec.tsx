import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';


jest.mock('lucide-react', () => ({
  AlertTriangle: () => <div data-testid="icon-alert-triangle" />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

global.fetch = jest.fn().mockResolvedValue({ ok: true });

const ThrowingComponent = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal content</div>;
};

const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});


describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleError.mockRestore();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
    expect(screen.getByText(/Произошла непредвиденная ошибка/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Попробовать снова' })).toBeInTheDocument();
  });

  it('does not render children when error occurred', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.queryByText('Normal content')).not.toBeInTheDocument();
  });

  it('calls fetch to log error to API when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/logs'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Test error message'),
      }),
    );
  });

  it('reloads page when retry button is clicked', () => {
    const reloadMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    window.location = { ...window.location, reload: reloadMock };

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }));

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('does not crash when fetch fails (silent error logging)', () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    expect(() =>
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow />
        </ErrorBoundary>,
      ),
    ).not.toThrow();
  });
});
