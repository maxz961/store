import Link from 'next/link';
import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { s } from './page.styled';
import type { OrdersPaginationProps } from './page.types';

export const OrdersPagination = ({ currentPage, totalPages, total, activeStatus }: OrdersPaginationProps) => (
  <div className={s.pagination}>
    <p className={s.pageInfo}>
      Всего {total} заказов · Страница {currentPage} из {totalPages}
    </p>
    <div className={s.pageButtons}>
      <When condition={currentPage > 1}>
        <Link href={`/admin/orders?page=${currentPage - 1}${activeStatus ? `&status=${activeStatus}` : ''}`}>
          <Button variant="outline" size="sm">Назад</Button>
        </Link>
      </When>
      <When condition={currentPage < totalPages}>
        <Link href={`/admin/orders?page=${currentPage + 1}${activeStatus ? `&status=${activeStatus}` : ''}`}>
          <Button variant="outline" size="sm">Вперёд</Button>
        </Link>
      </When>
    </div>
  </div>
);
