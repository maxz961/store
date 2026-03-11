import { render, screen } from '@testing-library/react';


jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

jest.mock('lucide-react', () => ({
  Mail: (props: any) => <div data-testid="icon-mail" {...props} />,
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

  it('has accessible aria-label', () => {
    render(<UserTrigger initials="ИП" />);
    expect(screen.getByLabelText('Меню пользователя')).toBeInTheDocument();
  });
});
