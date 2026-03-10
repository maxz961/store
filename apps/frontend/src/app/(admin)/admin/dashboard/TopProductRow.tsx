import { s } from './page.styled';
import type { TopProductRowProps } from './page.types';

export const TopProductRow = ({ rank, productName, soldCount }: TopProductRowProps) => (
  <div className={s.productRow}>
    <div className="flex items-center min-w-0">
      <span className={s.productRank}>{rank}</span>
      <span className={s.productName}>{productName}</span>
    </div>
    <span className={s.productSold}>{soldCount} продано</span>
  </div>
);
