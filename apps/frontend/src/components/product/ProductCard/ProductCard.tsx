'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ImageOff, Heart, Check } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { StarRating } from '@/components/ui/StarRating';
import { useCartStore } from '@/store/cart';
import { useAddFavorite, useFavoriteIds, useRemoveFavorite } from '@/lib/hooks/useFavorites';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatCurrency } from '@/lib/constants/format';
import { cn } from '@/lib/utils';
import type { Props } from './ProductCard.types';
import { s } from './ProductCard.styled';


export const ProductCard = ({ product }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuth();
  const { data: favoriteIds } = useFavoriteIds(isAuthenticated);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const isFavorite = isAuthenticated && (favoriteIds ?? []).includes(product.id);
  const isFavoritePending = addFavorite.isPending || removeFavorite.isPending;

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const reviews = product.reviews ?? [];
  const tags = product.tags ?? [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleImgLoad = () => setImgLoaded(true);

  const handleImgError = () => setImgError(true);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isFavorite) {
      removeFavorite.mutate(product.id);
    } else {
      addFavorite.mutate(product.id);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] ?? '',
      slug: product.slug,
      stock: product.stock,
    });
    setBouncing(true);
    setTimeout(() => setBouncing(false), 150);
    setAdded(true);
  };

  return (
    <div className={s.card}>
      <Link href={`/products/${product.slug}`} className={s.imageLink}>
        <If condition={!!product.images[0] && !imgError}>
          <Then>
            <When condition={!imgLoaded}>
              <div className={s.skeleton} />
            </When>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={s.image}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={handleImgLoad}
              onError={handleImgError}
            />
          </Then>
          <Else>
            <div className={s.placeholder}>
              <ImageOff className={s.placeholderIcon} />
              <span className={s.placeholderText}>Нет фото</span>
            </div>
          </Else>
        </If>
        <When condition={!!discount}>
          <span className={s.discount}>-{discount}%</span>
        </When>
        <When condition={isAuthenticated}>
          <button
            className={s.favoriteButton}
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
      </Link>

      <div className={s.content}>
        <Link href={`/products/${product.slug}`}>
          <h3 className={s.name}>{product.name}</h3>
        </Link>
        <p className={s.category}>{product.category.name}</p>

        <When condition={reviews.length > 0}>
          <div className={s.rating}>
            <StarRating value={Math.round(avgRating)} size="sm" />
            <span className={s.ratingCount}>({reviews.length})</span>
          </div>
        </When>

        <When condition={tags.length > 0}>
          <div className={s.tags}>
            {tags.slice(0, 3).map(({ tag }) => (
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

        <div className={s.footer}>
          <div className={s.priceGroup}>
            <When condition={!!product.comparePrice}>
              <span className={s.oldPrice}>
                {formatCurrency(Number(product.comparePrice))}
              </span>
            </When>
            <span className={s.price}>
              {formatCurrency(Number(product.price))}
            </span>
          </div>

          <If condition={product.stock > 0}>
            <Then>
              <button
                className={cn(s.cartButton, added && s.cartButtonAdded, bouncing && s.cartButtonBouncing)}
                onClick={handleAddToCart}
                aria-label={added ? 'В корзине' : 'Добавить в корзину'}
              >
                <If condition={added}>
                  <Then>
                    <Check className={s.cartButtonAddedIcon} />
                    <span className={s.cartButtonAddedText}>В корзине</span>
                  </Then>
                  <Else>
                    <ShoppingCart className={s.cartButtonIcon} />
                  </Else>
                </If>
              </button>
            </Then>
            <Else>
              <span className={s.outOfStock}>Нет в наличии</span>
            </Else>
          </If>
        </div>
      </div>
    </div>
  );
};
