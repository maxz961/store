import { cn } from '@/lib/utils';
import { s } from './page.styled';
import { FIELD_TOOLTIPS } from './page.constants';
import type { ProductsSectionProps } from './page.types';


export const ProductsSection = ({ products, selectedIds, onToggle }: ProductsSectionProps) => (
  <div className={s.card}>
    <h2 className={s.cardTitle}>Товары в акции</h2>
    <p className="text-xs text-muted-foreground">{FIELD_TOOLTIPS.products}</p>

    <div className={s.productsWrapper}>
      {products.map((product) => {
        const isSelected = selectedIds.includes(product.id);

        return (
          <button
            key={product.id}
            type="button"
            className={cn(s.productBtn, isSelected ? s.productBtnActive : s.productBtnInactive)}
            onClick={onToggle(product.id)}
          >
            {product.name}
          </button>
        );
      })}
    </div>
  </div>
);
