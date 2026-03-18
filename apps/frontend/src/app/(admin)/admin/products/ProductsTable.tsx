'use client';

import { When } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { ProductRow } from './ProductRow';
import { SortHeader } from './SortHeader';
import type { ProductsTableProps } from './page.types';


export const ProductsTable = ({ products, sortBy, sortOrder, search }: ProductsTableProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr>
            <SortHeader field="name" label={t('admin.products.colProduct')} currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
            <th className={s.th}>{t('admin.products.colCategory')}</th>
            <th className={s.th}>{t('admin.products.colTags')}</th>
            <SortHeader field="price" label={t('admin.products.colPrice')} align="right" currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
            <SortHeader field="stock" label={t('admin.products.colStock')} align="right" currentSortBy={sortBy} currentSortOrder={sortOrder} search={search} />
            <th className={s.thCenter}>{t('admin.products.colStatus')}</th>
            <th className={s.th} />
          </tr>
        </thead>
        <tbody>
          <When condition={products.length === 0}>
            <tr>
              <td colSpan={7} className={s.emptyRow}>{t('admin.products.notFound')}</td>
            </tr>
          </When>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
