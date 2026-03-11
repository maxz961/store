'use client';

import { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { s } from './ProductCatalog.styled';


interface CatalogPaginationProps {
  page: number;
  totalPages: number;
}


export const CatalogPagination = ({ page, totalPages }: CatalogPaginationProps) => {
  const { update } = useProductParams();

  const handleGoTo = useCallback(
    (p: number) => () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      update({ page: String(p) });
    },
    [update],
  );

  const pages = useMemo(() => {
    const result: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      result.push(1);
      if (page > 3) result.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) result.push(i);
      if (page < totalPages - 2) result.push('...');
      result.push(totalPages);
    }
    return result;
  }, [page, totalPages]);

  return (
    <div className={s.pagination}>
      <button
        className={s.paginationArrow}
        onClick={handleGoTo(page - 1)}
        disabled={page <= 1}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Назад</span>
      </button>

      <div className={s.paginationNumbers}>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className={s.paginationDots}>…</span>
          ) : (
            <button
              key={p}
              className={cn(s.paginationNumber, p === page && s.paginationNumberActive)}
              onClick={handleGoTo(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className={s.paginationArrow}
        onClick={handleGoTo(page + 1)}
        disabled={page >= totalPages}
        aria-label="Следующая страница"
      >
        <span>Вперёд</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
