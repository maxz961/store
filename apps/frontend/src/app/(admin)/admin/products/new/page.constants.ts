export const breadcrumbs = [
  { label: 'Админ-панель', href: '/admin/dashboard' },
  { label: 'Товары', href: '/admin/products' },
  { label: 'Новый товар' },
];

export const generateSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
