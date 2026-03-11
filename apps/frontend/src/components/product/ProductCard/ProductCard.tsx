'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ImageOff } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { useCartStore } from '@/store/cart';
import type { Props } from './ProductCard.types';
import { s } from './ProductCard.styled';


export const ProductCard = ({ product }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

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

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] ?? '',
      slug: product.slug,
      stock: product.stock,
    });
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
              <Badge key={tag.slug} variant="outline" className={s.tag}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </When>

        <div className={s.footer}>
          <div className={s.priceGroup}>
            <When condition={!!product.comparePrice}>
              <span className={s.oldPrice}>
                ${Number(product.comparePrice).toFixed(2)}
              </span>
            </When>
            <span className={s.price}>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <If condition={product.stock > 0}>
            <Then>
              <Button
                size="icon"
                className={s.cartButton}
                onClick={handleAddToCart}
                aria-label="Добавить в корзину"
              >
                <ShoppingCart className={s.cartButtonIcon} />
              </Button>
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
