export const makeBreadcrumbs = (title: string) => [
  { label: 'Админ-панель', href: '/admin/dashboard' },
  { label: 'Акции', href: '/admin/promotions' },
  { label: title },
];
