'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { s } from './page.styled';


interface SortHeaderProps {
  field: 'createdAt' | 'totalAmount';
  label: string;
  className?: string;
}


export const SortHeader = ({ field, label, className }: SortHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get('sortBy') ?? 'createdAt';
  const currentSortOrder = searchParams.get('sortOrder') ?? 'desc';
  const isActive = currentSortBy === field;
  const nextOrder = isActive && currentSortOrder === 'desc' ? 'asc' : 'desc';

  const handleSort = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', field);
    params.set('sortOrder', nextOrder);
    params.delete('page');
    router.push(`?${params.toString()}`);
  }, [field, nextOrder, router, searchParams]);

  return (
    <th className={className}>
      <button
        onClick={handleSort}
        className={cn(s.sortButton, isActive && s.sortButtonActive)}
      >
        {label}
        {isActive ? (
          currentSortOrder === 'desc'
            ? <ChevronDown className="h-3.5 w-3.5" />
            : <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 opacity-30" />
        )}
      </button>
    </th>
  );
};
