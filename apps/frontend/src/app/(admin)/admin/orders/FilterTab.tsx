import Link from 'next/link';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import type { FilterTabProps } from './page.types';

export const FilterTab = ({ value, label, isActive }: FilterTabProps) => (
  <Link
    href={value ? `/admin/orders?status=${value}` : '/admin/orders'}
    className={cn(s.filterTab, isActive ? s.filterTabActive : s.filterTabInactive)}
  >
    {label}
  </Link>
);
