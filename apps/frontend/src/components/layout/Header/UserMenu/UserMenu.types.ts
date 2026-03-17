export interface UserMenuProps {
  user: { name?: string | null; email: string };
  isAdmin: boolean;
  isManager: boolean;
  logout: () => void;
}
