import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmModal } from './ConfirmModal';


jest.mock('lucide-react', () => ({
  AlertTriangle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-alert" {...props} />,
}));

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  title: 'Удалить категорию?',
  description: 'Это действие нельзя отменить.',
};

describe('ConfirmModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open=true', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Удалить категорию?')).toBeInTheDocument();
    expect(screen.getByText('Это действие нельзя отменить.')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    render(<ConfirmModal {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Удалить' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ConfirmModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Отмена' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ConfirmModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByTestId('confirm-modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('disables both buttons when isLoading=true', () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Удалить' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeDisabled();
  });

  it('shows custom confirmLabel', () => {
    render(<ConfirmModal {...defaultProps} confirmLabel="Сохранить" />);
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();
  });

  it('renders ReactNode description', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        description={<span data-testid="rich-desc">Rich <strong>description</strong></span>}
      />,
    );
    expect(screen.getByTestId('rich-desc')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
  });
});
