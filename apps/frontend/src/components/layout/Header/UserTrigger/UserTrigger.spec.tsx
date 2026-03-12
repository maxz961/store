import { render, screen } from '@testing-library/react';


jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

jest.mock('lucide-react', () => ({
  Mail: (props: any) => <div data-testid="icon-mail" {...props} />,
  AlertTriangle: (props: any) => <div data-testid="icon-alert" {...props} />,
}));

import { UserTrigger } from './UserTrigger';


describe('UserTrigger', () => {
  it('shows initials when no image', () => {
    render(<UserTrigger initials="ИП" />);
    expect(screen.getByText('ИП')).toBeInTheDocument();
  });

  it('shows image when image is provided', () => {
    const { container } = render(<UserTrigger initials="ИП" image="https://example.com/avatar.jpg" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('shows unread dot when hasUnreadMessages is true', () => {
    render(<UserTrigger initials="ИП" hasUnreadMessages />);
    expect(screen.getByTestId('unread-dot')).toBeInTheDocument();
  });

  it('hides unread dot when hasUnreadMessages is false', () => {
    render(<UserTrigger initials="ИП" hasUnreadMessages={false} />);
    expect(screen.queryByTestId('unread-dot')).not.toBeInTheDocument();
  });

  it('hides unread dot when hasUnreadMessages is not provided', () => {
    render(<UserTrigger initials="ИП" />);
    expect(screen.queryByTestId('unread-dot')).not.toBeInTheDocument();
  });

  it('shows image-error dot when hasImageErrors is true', () => {
    render(<UserTrigger initials="ИП" hasImageErrors />);
    expect(screen.getByTestId('image-error-dot')).toBeInTheDocument();
  });

  it('image error dot has higher priority than unread messages', () => {
    render(<UserTrigger initials="ИП" hasImageErrors hasUnreadMessages />);
    expect(screen.getByTestId('image-error-dot')).toBeInTheDocument();
    expect(screen.queryByTestId('unread-dot')).not.toBeInTheDocument();
  });

  it('shows unread dot when no image errors but has unread messages', () => {
    render(<UserTrigger initials="ИП" hasImageErrors={false} hasUnreadMessages />);
    expect(screen.getByTestId('unread-dot')).toBeInTheDocument();
    expect(screen.queryByTestId('image-error-dot')).not.toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<UserTrigger initials="ИП" />);
    expect(screen.getByLabelText('Меню пользователя')).toBeInTheDocument();
  });
});
