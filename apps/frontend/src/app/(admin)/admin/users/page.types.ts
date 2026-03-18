export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

export type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

export interface UsersTableProps {
  users: UserRow[];
  canEditRole: boolean;
  onUpdateRole: (id: string, role: UserRole) => void;
  onToggleBan: (id: string, isBanned: boolean) => void;
}

export interface UserRowProps {
  user: UserRow;
  canEditRole: boolean;
  onUpdateRole: (id: string, role: UserRole) => void;
  onToggleBan: (id: string, isBanned: boolean) => void;
}
