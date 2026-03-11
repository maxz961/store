'use client';

import { useState, useCallback } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAdminAllReviews, useAdminDeleteReview, type ReviewSort } from '@/lib/hooks/useReviews';
import { ReviewsTable } from './ReviewsTable';
import { ReviewsPagination } from './ReviewsPagination';
import { breadcrumbs, SORT_OPTIONS } from './page.constants';
import { s } from './page.styled';
import { cn } from '@/lib/utils';


const AdminReviewsPage = () => {
  const [sort, setSort] = useState<ReviewSort>('newest');
  const [page, setPage] = useState(1);

  const { data } = useAdminAllReviews(sort, page);
  const reviews = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const deleteReview = useAdminDeleteReview('');

  const handleSort = useCallback((value: ReviewSort) => () => {
    setSort(value);
    setPage(1);
  }, []);

  const handleDelete = useCallback((reviewId: string) => {
    deleteReview.mutate({ reviewId, productId: '' });
  }, [deleteReview]);

  const handlePrevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const handleNextPage = useCallback(() => setPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.toolbar}>
        <span className={s.sortLabel}>Сортировка:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cn(s.sortButton, sort === opt.value ? s.sortActive : s.sortInactive)}
            onClick={handleSort(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ReviewsTable reviews={reviews} onDelete={handleDelete} />

      <ReviewsPagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />
    </div>
  );
};

export default AdminReviewsPage;
