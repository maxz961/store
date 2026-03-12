import Image from 'next/image';
import { If, Then, Else } from 'react-if';
import { s } from './page.styled';
import type { LowStockRowProps } from './page.types';


export const LowStockRow = ({ name, stock, image }: LowStockRowProps) => {
  const badgeClass = stock <= 2 ? s.lowStockBadgeCritical : s.lowStockBadgeWarning;
  const stockLabel = stock === 0 ? 'Нет в наличии' : `${stock} шт.`;

  return (
    <div className={s.lowStockRow}>
      <div className={s.lowStockInfo}>
        <If condition={!!image}>
          <Then>
            <Image
              src={image!}
              alt={name}
              width={32}
              height={32}
              className={s.lowStockImage}
              unoptimized
            />
          </Then>
          <Else>
            <div className={s.lowStockImage} />
          </Else>
        </If>
        <span className={s.lowStockName}>{name}</span>
      </div>
      <span className={badgeClass}>{stockLabel}</span>
    </div>
  );
};
