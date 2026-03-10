'use client';

import { useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { ImageOff, Star, ShoppingCart, Minus, Plus } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useProduct } from '@/lib/hooks/useProducts';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';
import { s } from './page.styled';


interface Props {
  params: Promise<{ slug: string }>;
}

const ProductPage = (props: Props) => {
  const { slug } = use(props.params);
  const { data: product, isLoading, isError } = useProduct(slug);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mainImgError, setMainImgError] = useState(false);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.loading}>
          <div className={s.spinner} />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={s.page}>
        <div className={s.error}>
          <p className={s.errorTitle}>Товар не найден</p>
          <p className={s.errorText}>Возможно, он был удалён или ссылка неверна</p>
        </div>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round((1 - product.price / Number(product.comparePrice)) * 100)
    : null;

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const handleSelectImage = (index: number) => () => {
    setSelectedImage(index);
    setMainImgLoaded(false);
    setMainImgError(false);
  };

  const handleDecreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const handleIncreaseQuantity = () => setQuantity((q) => Math.min(product.stock, q + 1));

  const handleAddToCart = () => {
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
  };

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/products' },
    { label: product.category.name, href: `/products?categorySlug=${product.category.slug}` },
    { label: product.name },
  ];

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.layout}>
        {/* Gallery */}
        <div className={s.gallery}>
          <div className={s.mainImage}>
            <If condition={!!product.images[selectedImage] && !mainImgError}>
              <Then>
                <When condition={!mainImgLoaded}>
                  <div className={s.skeleton} />
                </When>
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className={s.image}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  onLoad={() => setMainImgLoaded(true)}
                  onError={() => setMainImgError(true)}
                />
              </Then>
              <Else>
                <div className={s.placeholder}>
                  <ImageOff className={s.placeholderIcon} />
                </div>
              </Else>
            </If>
          </div>

          <When condition={product.images.length > 1}>
            <div className={s.thumbnails}>
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={handleSelectImage(index)}
                  className={cn(s.thumb, index === selectedImage ? s.thumbActive : s.thumbInactive)}
                >
                  <Image src={img} alt={`${product.name} ${index + 1}`} fill className={s.thumbImage} sizes="64px" />
                </button>
              ))}
            </div>
          </When>
        </div>

        {/* Info */}
        <div className={s.info}>
          <p className={s.category}>{product.category.name}</p>
          <h1 className={s.title}>{product.name}</h1>

          <When condition={product.reviews.length > 0}>
            <div className="flex items-center gap-2">
              <div className={s.reviewStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(s.reviewStar, star <= Math.round(avgRating) ? s.reviewStarFilled : s.reviewStarEmpty)}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
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
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className={s.quantity}>{quantity}</span>
                <button
                  className={s.quantityButton}
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button size="lg" className={s.addToCartButton} onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                В корзину
              </Button>
            </div>
          </When>
        </div>
      </div>

      {/* Reviews */}
      <div className={s.reviewsSection}>
        <h2 className={s.reviewsTitle}>
          Отзывы {product.reviews.length > 0 && `(${product.reviews.length})`}
        </h2>

        <If condition={product.reviews.length === 0}>
          <Then>
            <p className={s.reviewsEmpty}>Пока нет отзывов</p>
          </Then>
          <Else>
            <div className={s.reviewsList}>
              {product.reviews.map((review) => (
                <div key={review.id} className={s.reviewCard}>
                  <div className={s.reviewHeader}>
                    <span className={s.reviewAuthor}>{review.user.name ?? 'Аноним'}</span>
                    <span className={s.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className={s.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(s.reviewStar, star <= review.rating ? s.reviewStarFilled : s.reviewStarEmpty)}
                      />
                    ))}
                  </div>
                  <When condition={!!review.comment}>
                    <p className={s.reviewComment}>{review.comment}</p>
                  </When>
                </div>
              ))}
            </div>
          </Else>
        </If>
      </div>
    </div>
  );
};

export default ProductPage;
