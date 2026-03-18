import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { s } from './page.styled';
import type { ReviewsPaginationProps } from './page.types';


export const ReviewsPagination = ({ page, totalPages, total, onPrev, onNext }: ReviewsPaginationProps) => (
  <div className={s.pagination}>
    <p className={s.pageInfo}>
      Всего {total} отзывов · Страница {page} из {totalPages}
    </p>
    <div className={s.pageButtons}>
      <When condition={page > 1}>
        <Button variant="outline" size="sm" onClick={onPrev}>Назад</Button>
      </When>
      <When condition={page < totalPages}>
        <Button variant="outline" size="sm" onClick={onNext}>Вперёд</Button>
      </When>
    </div>
  </div>
);
