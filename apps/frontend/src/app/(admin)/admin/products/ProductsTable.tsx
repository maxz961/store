import { When } from 'react-if';
import { s } from './page.styled';
import { ProductRow } from './ProductRow';
import type { ProductsTableProps } from './page.types';

export const ProductsTable = ({ products }: ProductsTableProps) => (
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
        <When condition={products.length === 0}>
          <tr>
            <td colSpan={7} className={s.emptyRow}>Товары не найдены</td>
          </tr>
        </When>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </tbody>
    </table>
  </div>
);
