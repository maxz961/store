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
          <SortHeader field="name" label="Product" currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
          <th className={s.th}>Category</th>
          <th className={s.th}>Tags</th>
          <SortHeader field="price" label="Price" align="right" currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
          <SortHeader field="stock" label="Stock" align="right" currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
          <th className={s.thCenter}>Status</th>
          <th className={s.th} />
        </tr>
      </thead>
      <tbody>
        <When condition={products.length === 0}>
          <tr>
            <td colSpan={7} className={s.emptyRow}>Products not found</td>
          </tr>
        </When>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </tbody>
    </table>
  </div>
);
