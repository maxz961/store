import type { ReviewSort } from '@/lib/hooks/useReviews';


export const breadcrumbs = [
  { label: 'Админ-панель', href: '/admin/dashboard' },
  { label: 'Отзывы' },
];

export const SORT_OPTIONS: { value: ReviewSort; label: string }[] = [
  { value: 'newest', label: 'Новые' },
  { value: 'oldest', label: 'Старые' },
  { value: 'highest', label: 'Высокий рейтинг' },
  { value: 'lowest', label: 'Низкий рейтинг' },
];
