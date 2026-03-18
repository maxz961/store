export const makeBreadcrumbs = (title: string) => [
  { label: 'Admin', href: '/admin/dashboard' },
  { label: 'Promotions', href: '/admin/promotions' },
  { label: title },
];
