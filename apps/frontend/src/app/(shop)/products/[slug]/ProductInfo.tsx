import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { When } from 'react-if';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import type { ProductInfoProps } from './page.types';


export const ProductInfo = ({
  product,
  avgRating,
  discount,
  quantity,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onAddToCart,
}: ProductInfoProps) => {
  return (
    <div className={s.info}>
      <p className={s.category}>{product.category.name}</p>
      <h1 className={s.title}>{product.name}</h1>

      <When condition={product.reviews.length > 0}>
        <div className={s.ratingRow}>
          <StarRating value={Math.round(avgRating)} size="sm" />
          <span className={s.ratingText}>
            {avgRating.toFixed(1)} ({product.reviews.length})
          </span>
        </div>
      </When>

      <div className={s.priceGroup}>
        <span className={s.price}>${Number(product.price).toFixed(2)}</span>
        <When condition={!!product.comparePrice}>
          <span className={s.oldPrice}>${Number(product.comparePrice).toFixed(2)}</span>
        </When>
        <When condition={!!discount}>
          <span className={s.discount}>-{discount}%</span>
        </When>
      </div>

      <p className={cn(s.stock, product.stock > 0 ? s.stockInStock : s.stockOut)}>
        {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
      </p>

      <div className={s.divider} />

      <p className={s.description}>{product.description}</p>

      <When condition={product.tags.length > 0}>
        <div className={s.tags}>
          {product.tags.map(({ tag }) => (
            <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
          ))}
        </div>
      </When>

      <div className={s.divider} />

      <When condition={product.stock > 0}>
        <div className={s.actions}>
          <div className={s.quantityGroup}>
            <button
              className={s.quantityButton}
              onClick={onDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className={s.quantity}>{quantity}</span>
            <button
              className={s.quantityButton}
              onClick={onIncreaseQuantity}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button size="lg" className={s.addToCartButton} onClick={onAddToCart}>
            <ShoppingCart className={s.buttonIcon} />
            В корзину
          </Button>
        </div>
      </When>
    </div>
  );
};
