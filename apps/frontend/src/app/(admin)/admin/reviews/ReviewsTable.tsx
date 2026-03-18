import { If, Then, Else } from 'react-if';
import { ReviewRow } from './ReviewRow';
import { s } from './page.styled';
import type { ReviewsTableProps } from './page.types';


export const ReviewsTable = ({ reviews, onDelete }: ReviewsTableProps) => (
  <div className={s.tableWrapper}>
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th className={s.th}>Пользователь</th>
          <th className={s.th}>Товар</th>
          <th className={s.th}>Рейтинг</th>
          <th className={s.th}>Комментарий</th>
          <th className={s.th}>Ответ</th>
          <th className={s.th}>Дата</th>
          <th className={s.th}>Действия</th>
        </tr>
      </thead>
      <tbody>
        <If condition={reviews.length === 0}>
          <Then>
            <tr>
              <td colSpan={7} className={s.emptyRow}>Отзывов нет</td>
            </tr>
          </Then>
          <Else>
            {reviews.map((review) => (
              <ReviewRow key={review.id} review={review} onDelete={onDelete} />
            ))}
          </Else>
        </If>
      </tbody>
    </table>
  </div>
);
