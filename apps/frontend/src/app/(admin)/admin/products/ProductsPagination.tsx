import Link from 'next/link';
import { When } from 'react-if';
import { Button } from '@/components/ui/button';
import { s } from './page.styled';
import type { ProductsPaginationProps } from './page.types';


export const ProductsPagination = ({ currentPage, totalPages, total }: ProductsPaginationProps) => (
  <div className={s.pagination}>
    <p className={s.pageInfo}>
      Всего {total} товаров · Страница {currentPage} из {totalPages}
    </p>
    <div className={s.pageButtons}>
      <When condition={currentPage > 1}>
        <Link href={`/admin/products?page=${currentPage - 1}`}>
          <Button variant="outline" size="sm">Назад</Button>
        </Link>
      </When>
      <When condition={currentPage < totalPages}>
        <Link href={`/admin/products?page=${currentPage + 1}`}>
          <Button variant="outline" size="sm">Вперёд</Button>
        </Link>
      </When>
    </div>
  </div>
);
