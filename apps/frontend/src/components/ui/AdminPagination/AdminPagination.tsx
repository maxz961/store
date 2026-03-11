'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { s } from './AdminPagination.styled';


interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  itemLabel: string;
}


export const AdminPagination = ({ page, totalPages, total, itemLabel }: AdminPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoTo = useCallback(
    (p: number) => () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(p));
      window.scrollTo(0, 0);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
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
    <div className={s.wrapper}>
      <p className={s.info}>
        Всего {total} {itemLabel} · Страница {page} из {totalPages}
      </p>

      <div className={s.numbers}>
        <button
          className={s.arrow}
          onClick={handleGoTo(page - 1)}
          disabled={page <= 1}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Назад</span>
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className={s.dots}>…</span>
          ) : (
            <button
              key={p}
              className={cn(s.number, p === page && s.numberActive)}
              onClick={handleGoTo(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          className={s.arrow}
          onClick={handleGoTo(page + 1)}
          disabled={page >= totalPages}
          aria-label="Следующая страница"
        >
          <span>Вперёд</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
