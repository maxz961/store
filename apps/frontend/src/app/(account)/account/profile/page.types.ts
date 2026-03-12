export interface UserCardProps {
  name: string | null;
  email: string;
  image: string | null;
  initials: string;
  memberSince: string;
  onLogout: () => void;
}

export interface QuickLinksProps {}
