'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { s } from './ProductCard.styled';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  category: { name: string; slug: string };
  tags: { tag: { name: string; slug: string } }[];
}

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

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
        {product.images[0] && !imgError ? (
          <>
            {!imgLoaded && <div className={s.skeleton} />}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={s.image}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className={s.placeholder}>
            <ImageOff className={s.placeholderIcon} />
            <span className={s.placeholderText}>Нет фото</span>
          </div>
        )}
        {discount && (
          <span className={s.discount}>-{discount}%</span>
        )}
      </Link>

      <div className={s.content}>
        <Link href={`/products/${product.slug}`}>
          <h3 className={s.name}>{product.name}</h3>
        </Link>
        <p className={s.category}>{product.category.name}</p>

        {product.tags.length > 0 && (
          <div className={s.tags}>
            {product.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag.slug} variant="secondary" className={s.tag}>
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className={s.footer}>
          <div className={s.priceGroup}>
            {product.comparePrice && (
              <span className={s.oldPrice}>
                ${Number(product.comparePrice).toFixed(2)}
              </span>
            )}
            <span className={s.price}>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {product.stock > 0 ? (
            <Button
              size="icon"
              className={s.cartButton}
              onClick={handleAddToCart}
              aria-label="Добавить в корзину"
            >
              <ShoppingCart className={s.cartButtonIcon} />
            </Button>
          ) : (
            <span className={s.outOfStock}>Нет в наличии</span>
          )}
        </div>
      </div>
    </div>
  );
};
