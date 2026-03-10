import { When } from 'react-if';
import { TopProductRow } from './TopProductRow';
import { s } from './page.styled';
import type { TopProductsCardProps } from './page.types';

export const TopProductsCard = ({ topProducts }: TopProductsCardProps) => (
  <div className={s.card}>
    <h2 className={s.cardTitle}>Топ товары</h2>
    <div className="mt-4">
      {topProducts.slice(0, 5).map(({ product, soldCount }, i) => (
        <TopProductRow
          key={i}
          rank={i + 1}
          productName={product?.name ?? 'Неизвестный'}
          soldCount={soldCount}
        />
      ))}
      <When condition={topProducts.length === 0}>
        <p className={s.emptyText}>Нет данных о продажах</p>
      </When>
    </div>
  </div>
);
