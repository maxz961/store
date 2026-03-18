export const breadcrumbs = [
  { label: 'Admin panel', href: '/admin/dashboard' },
  { label: 'Users' },
];

export const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: 'Customer',
  MANAGER: 'Manager',
  ADMIN: 'Admin',
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
