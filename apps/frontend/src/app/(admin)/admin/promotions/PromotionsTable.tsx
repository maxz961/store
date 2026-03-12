import { When } from 'react-if';
import { s } from './page.styled';
import { PromotionRow } from './PromotionRow';
import type { PromotionsTableProps } from './page.types';


export const PromotionsTable = ({ promotions }: PromotionsTableProps) => (
  <div className={s.tableWrapper}>
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th className={s.th}>Акция</th>
          <th className={s.th}>Период</th>
          <th className={s.th}>Скидка</th>
          <th className={s.thCenter}>Статус</th>
          <th className={s.thCenter}>Позиция</th>
          <th className={s.th} />
        </tr>
      </thead>
      <tbody>
        <When condition={promotions.length === 0}>
          <tr>
            <td colSpan={6} className={s.emptyRow}>Акции не найдены</td>
          </tr>
        </When>
        {promotions.map((promotion) => (
          <PromotionRow key={promotion.id} promotion={promotion} />
        ))}
      </tbody>
    </table>
  </div>
);
