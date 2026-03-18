import { When } from 'react-if';
import { s } from './page.styled';
import { PromotionRow } from './PromotionRow';
import type { PromotionsTableProps } from './page.types';


export const PromotionsTable = ({ promotions }: PromotionsTableProps) => (
  <div className={s.tableWrapper}>
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th className={s.th}>Promotion</th>
          <th className={s.th}>Period</th>
          <th className={s.th}>Discount</th>
          <th className={s.thCenter}>Status</th>
          <th className={s.thCenter}>Position</th>
          <th className={s.th} />
        </tr>
      </thead>
      <tbody>
        <When condition={promotions.length === 0}>
          <tr>
            <td colSpan={6} className={s.emptyRow}>No promotions found</td>
          </tr>
        </When>
        {promotions.map((promotion) => (
          <PromotionRow key={promotion.id} promotion={promotion} />
        ))}
      </tbody>
    </table>
  </div>
);
