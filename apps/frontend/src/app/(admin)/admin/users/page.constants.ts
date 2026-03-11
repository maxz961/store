export const breadcrumbs = [
  { label: 'Админ-панель', href: '/admin/dashboard' },
  { label: 'Пользователи' },
];

export const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: 'Покупатель',
  ADMIN: 'Админ',
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
