import { If, Then, Else } from 'react-if';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LowStockRow } from './LowStockRow';
import { s } from './page.styled';
import type { LowStockCardProps } from './page.types';


export const LowStockCard = ({ products }: LowStockCardProps) => (
  <div className={s.lowStockCard}>
    <h2 className={s.lowStockTitle}>
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      Товары с низким остатком
    </h2>
    <If condition={products.length > 0}>
      <Then>
        <div className={s.cardBody}>
          {products.map((product) => (
            <LowStockRow
              key={product.id}
              name={product.name}
              slug={product.slug}
              stock={product.stock}
              image={product.image}
            />
          ))}
        </div>
      </Then>
      <Else>
        <div className={s.lowStockEmpty}>
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <span>Все товары в наличии</span>
        </div>
      </Else>
    </If>
  </div>
);
