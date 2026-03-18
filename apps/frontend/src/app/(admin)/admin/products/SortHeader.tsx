import Link from 'next/link';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { s } from './page.styled';
import type { SortHeaderProps, SortOrder } from './page.types';


const buildSortUrl = (
  field: string,
  currentSortBy: string,
  currentSortOrder: SortOrder,
  search?: string,
): string => {
  const nextOrder: SortOrder =
    field === currentSortBy && currentSortOrder === 'asc' ? 'desc' : 'asc';
  const params = new URLSearchParams({ page: '1', sortBy: field, sortOrder: nextOrder });
  if (search) params.set('search', search);
  return `/admin/products?${params.toString()}`;
};


export const SortHeader = ({
  field,
  label,
  align = 'left',
  currentSortBy,
  currentSortOrder,
  search,
}: SortHeaderProps) => {
  const isActive = field === currentSortBy;
  const thClass = align === 'right' ? s.thRight : align === 'center' ? s.thCenter : s.th;

  const Icon = isActive
    ? currentSortOrder === 'asc' ? ArrowUp : ArrowDown
    : ArrowUpDown;

  return (
    <th className={thClass}>
      <Link
        href={buildSortUrl(field, currentSortBy, currentSortOrder, search)}
        className={s.sortLink}
        data-active={isActive}
      >
        {label}
        <Icon className={isActive ? s.sortIconActive : s.sortIcon} />
      </Link>
    </th>
  );
};
