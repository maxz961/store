'use client';

import { useState, useCallback } from 'react';
import { ShoppingCart, Minus, Plus, Heart } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { StarRating } from '@/components/ui/StarRating';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAddFavorite, useFavoriteIds, useRemoveFavorite } from '@/lib/hooks/useFavorites';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import type { ProductInfoProps } from './page.types';


export const ProductInfo = ({ product }: ProductInfoProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuth();
  const { data: favoriteIds } = useFavoriteIds(isAuthenticated);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const [quantity, setQuantity] = useState(1);

  const isFavorite = isAuthenticated && (favoriteIds ?? []).includes(product.id);
  const isFavoritePending = addFavorite.isPending || removeFavorite.isPending;

  const reviews = product.reviews ?? [];
  const tags = product.tags ?? [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const discount = product.comparePrice
    ? Math.round((1 - product.price / Number(product.comparePrice)) * 100)
    : null;

  const handleDecrease = useCallback(() => setQuantity((q) => Math.max(1, q - 1)), []);
  const handleIncrease = useCallback(() => setQuantity((q) => Math.min(product.stock, q + 1)), [product.stock]);

  const handleToggleFavorite = useCallback(() => {
    if (!isAuthenticated) return;
    if (isFavorite) {
      removeFavorite.mutate(product.id);
    } else {
      addFavorite.mutate(product.id);
    }
  }, [isAuthenticated, isFavorite, product.id, addFavorite, removeFavorite]);

  const handleAddToCart = useCallback(() => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0] ?? '',
        slug: product.slug,
        stock: product.stock,
      });
    }
    setQuantity(1);
  }, [quantity, addItem, product]);

  return (
    <div className={s.info}>
      <p className={s.category}>{product.category.name}</p>
      <h1 className={s.title}>{product.name}</h1>

      <When condition={reviews.length > 0}>
        <div className={s.ratingRow}>
          <StarRating value={Math.round(avgRating)} size="sm" />
          <span className={s.ratingText}>
            {avgRating.toFixed(1)} ({reviews.length})
          </span>
        </div>
      </When>

      <div className={s.priceGroup}>
        <span className={s.price}>{formatCurrency(Number(product.price))}</span>
        <When condition={!!product.comparePrice}>
          <span className={s.oldPrice}>{formatCurrency(Number(product.comparePrice))}</span>
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

      <When condition={tags.length > 0}>
        <div className={s.tags}>
          {tags.map(({ tag }) => (
            <Badge
              key={tag.slug}
              variant="outline"
              className={s.tag}
              style={tag.color ? {
                borderColor: `${tag.color}40`,
                backgroundColor: `${tag.color}12`,
                color: tag.color,
              } : undefined}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </When>

      <div className={s.divider} />

      <When condition={product.stock > 0}>
        <div className={s.actions}>
          <div className={s.quantityGroup}>
            <button
              className={s.quantityButton}
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className={s.quantity}>{quantity}</span>
            <button
              className={s.quantityButton}
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button size="lg" className={s.addToCartButton} onClick={handleAddToCart}>
            <ShoppingCart className={s.buttonIcon} />
            В корзину
          </Button>
          <When condition={isAuthenticated}>
            <button
              className={cn(s.favoriteButton, isFavorite && s.favoriteButtonActive)}
              onClick={handleToggleFavorite}
              disabled={isFavoritePending}
              aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            >
              <If condition={isFavoritePending}>
                <Then><Spinner size="sm" /></Then>
                <Else><Heart className={cn(s.favoriteIcon, isFavorite ? s.favoriteIconActive : s.favoriteIconInactive)} /></Else>
              </If>
            </button>
          </When>
        </div>
      </When>
    </div>
  );
};
