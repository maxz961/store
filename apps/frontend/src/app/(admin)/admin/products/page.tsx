import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { api } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { s } from './page.styled';
import { formatCurrency } from '@/lib/constants/format';
import type { ProductsResponse } from './page.types';
import { breadcrumbs } from './page.constants';

const AdminProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) => {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.page) params.set('page', sp.page);
  if (sp.search) params.set('search', sp.search);

  const data = await api.get<ProductsResponse>(`/products/admin?${params.toString()}`, { cache: 'no-store' });
  const currentPage = data.page;

  const productsTable = (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr>
            <th className={s.th}>Товар</th>
            <th className={s.th}>Категория</th>
            <th className={s.th}>Теги</th>
            <th className={s.thRight}>Цена</th>
            <th className={s.thRight}>Остаток</th>
            <th className={s.thCenter}>Статус</th>
            <th className={s.th} />
          </tr>
        </thead>
        <tbody>
          <When condition={data.items.length === 0}>
            <tr>
              <td colSpan={7} className={s.emptyRow}>Товары не найдены</td>
            </tr>
          </When>
          {data.items.map((product) => (
            <tr key={product.id} className={s.tr}>
              <td className={s.td}>
                <div className={s.productCell}>
                  <If condition={product.images.length > 0}>
                    <Then>
                      <img src={product.images[0]} alt="" className={s.productImage} />
                    </Then>
                    <Else>
                      <div className={s.productImageFallback}>—</div>
                    </Else>
                  </If>
                  <span className={s.productName}>{product.name}</span>
                </div>
              </td>
              <td className={s.td}>
                <span className={s.category}>{product.category?.name ?? '—'}</span>
              </td>
              <td className={s.td}>
                <div className={s.tagsWrapper}>
                  {product.tags?.slice(0, 3).map((t) => (
                    <span key={t.tag.slug} className={s.tag}>{t.tag.name}</span>
                  ))}
                </div>
              </td>
              <td className={s.tdRight}>
                <span className={s.price}>{formatCurrency(Number(product.price))}</span>
              </td>
              <td className={s.tdRight}>
                <span className={product.stock <= 5 ? s.stockLow : s.stock}>{product.stock}</span>
              </td>
              <td className={s.tdCenter}>
                <If condition={product.isPublished}>
                  <Then><span className={s.statusPublished}>Опубликован</span></Then>
                  <Else><span className={s.statusDraft}>Черновик</span></Else>
                </If>
              </td>
              <td className={s.td}>
                <Link href={`/admin/products/${product.id}`} className={s.editLink}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const pagination = (
    <div className={s.pagination}>
      <p className={s.pageInfo}>
        Всего {data.total} товаров · Страница {currentPage} из {data.totalPages}
      </p>
      <div className={s.pageButtons}>
        <When condition={currentPage > 1}>
          <Link href={`/admin/products?page=${currentPage - 1}`}>
            <Button variant="outline" size="sm">Назад</Button>
          </Link>
        </When>
        <When condition={currentPage < data.totalPages}>
          <Link href={`/admin/products?page=${currentPage + 1}`}>
            <Button variant="outline" size="sm">Вперёд</Button>
          </Link>
        </When>
      </div>
    </div>
  );

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.header}>
        <h1 className={s.title}>Товары</h1>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Добавить товар
          </Button>
        </Link>
      </div>

      {productsTable}
      {pagination}
    </div>
  );
};

export default AdminProductsPage;
