'use client';

import { useState } from 'react';
import { use } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Spinner } from '@/components/ui/Spinner';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductReviews } from './ProductReviews';
import { useProduct } from '@/lib/hooks/useProducts';
import { useCartStore } from '@/store/cart';
import { s } from './page.styled';
import type { Props } from './page.types';


const ProductPage = (props: Props) => {
  const { slug } = use(props.params);
  const { data: product, isLoading, isError } = useProduct(slug);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mainImgError, setMainImgError] = useState(false);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  if (isLoading) {
    return (
      <div className={s.page}>
        <Spinner />
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

  const handleMainImgLoad = () => setMainImgLoaded(true);

  const handleMainImgError = () => setMainImgError(true);

  const handleOpenReviewModal = () => setShowReviewModal(true);

  const handleCloseReviewModal = () => setShowReviewModal(false);

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
    { label: 'Каталог', href: '/products' },
    { label: product.category.name, href: `/products?categorySlug=${product.category.slug}` },
    { label: product.name },
  ];

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.layout}>
        <ProductGallery
          images={product.images}
          name={product.name}
          selectedImage={selectedImage}
          mainImgLoaded={mainImgLoaded}
          mainImgError={mainImgError}
          onSelectImage={handleSelectImage}
          onMainImgLoad={handleMainImgLoad}
          onMainImgError={handleMainImgError}
        />

        <ProductInfo
          product={product}
          avgRating={avgRating}
          discount={discount}
          quantity={quantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onIncreaseQuantity={handleIncreaseQuantity}
          onAddToCart={handleAddToCart}
        />
      </div>

      <ProductReviews
        productId={product.id}
        productSlug={slug}
        reviews={product.reviews}
        avgRating={avgRating}
        showReviewModal={showReviewModal}
        onOpenReviewModal={handleOpenReviewModal}
        onCloseReviewModal={handleCloseReviewModal}
      />
    </div>
  );
};

export default ProductPage;
