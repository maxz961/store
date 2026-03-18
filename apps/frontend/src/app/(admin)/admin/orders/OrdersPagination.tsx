'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { OrdersPaginationProps } from './page.types';


const buildPageUrl = (page: number, status?: string, sortBy?: string, sortOrder?: string): string => {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (sortBy) params.set('sortBy', sortBy);
  if (sortOrder) params.set('sortOrder', sortOrder);
  return `/admin/orders?${params.toString()}`;
};

const buildPages = (currentPage: number, totalPages: number): (number | '...')[] => {
  const result: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) result.push(i);
  } else {
    result.push(1);
    if (currentPage > 3) result.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) result.push(i);
    if (currentPage < totalPages - 2) result.push('...');
    result.push(totalPages);
  }
  return result;
};


export const OrdersPagination = ({ currentPage, totalPages, activeStatus, sortBy, sortOrder }: OrdersPaginationProps) => {
  const { t } = useLanguage();
  const pages = buildPages(currentPage, totalPages);

  return (
    <div className={s.pagination}>
      {currentPage <= 1 ? (
        <span className={s.paginationArrowDisabled}>
          <ChevronLeft className="h-4 w-4" />
          <span>{t('admin.products.prev')}</span>
        </span>
      ) : (
        <Link href={buildPageUrl(currentPage - 1, activeStatus, sortBy, sortOrder)} className={s.paginationArrow}>
          <ChevronLeft className="h-4 w-4" />
          <span>{t('admin.products.prev')}</span>
        </Link>
      )}

      <div className={s.paginationNumbers}>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className={s.paginationDots}>…</span>
          ) : (
            <Link
              key={p}
              href={buildPageUrl(p, activeStatus, sortBy, sortOrder)}
              className={cn(s.paginationNumber, p === currentPage && s.paginationNumberActive)}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </Link>
          )
        )}
      </div>

      {currentPage >= totalPages ? (
        <span className={s.paginationArrowDisabled}>
          <span>{t('admin.products.next')}</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <Link href={buildPageUrl(currentPage + 1, activeStatus, sortBy, sortOrder)} className={s.paginationArrow}>
          <span>{t('admin.products.next')}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
};
