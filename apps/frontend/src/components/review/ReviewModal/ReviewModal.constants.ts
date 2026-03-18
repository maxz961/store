import type { ReviewSort } from '@/lib/hooks/useReviews';


export const SORT_OPTIONS: { value: ReviewSort; labelKey: string }[] = [
  { value: 'newest', labelKey: 'review.sortNewest' },
  { value: 'oldest', labelKey: 'review.sortOldest' },
  { value: 'highest', labelKey: 'review.sortHighest' },
  { value: 'lowest', labelKey: 'review.sortLowest' },
];
