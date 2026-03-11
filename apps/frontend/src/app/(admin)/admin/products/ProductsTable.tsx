import { When } from 'react-if';
import { s } from './page.styled';
import { ProductRow } from './ProductRow';
import { SortHeader } from './SortHeader';
import type { ProductsTableProps } from './page.types';


export const ProductsTable = ({ products, sortBy, sortOrder, search }: ProductsTableProps) => (
  <div className={s.tableWrapper}>
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <SortHeader field="name" label="Товар" currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
          <th className={s.th}>Категория</th>
          <th className={s.th}>Теги</th>
          <SortHeader field="price" label="Цена" align="right" currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
          <SortHeader field="stock" label="Остаток" align="right" currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
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
