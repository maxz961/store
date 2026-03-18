'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { api } from '@/lib/api';
import { GalleryThumb } from './GalleryThumb';
import { s } from './page.styled';
import type { ProductGalleryProps } from './page.types';


export const ProductGallery = ({ productId, images, name, unoptimized }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);
  const [mainImgError, setMainImgError] = useState(false);
  const errorReported = useRef(false);

  const handleSelectImage = useCallback((index: number) => () => {
    setSelectedImage(index);
    setMainImgLoaded(false);
    setMainImgError(false);
  }, []);

  const handleMainImgLoad = useCallback(() => setMainImgLoaded(true), []);

  const handleMainImgError = useCallback(() => {
    setMainImgError(true);
    if (!productId || errorReported.current) return;
    errorReported.current = true;
    api.patch(`/products/${productId}/image-error`).catch(() => undefined);
  }, [productId]);

  return (
    <div className={s.gallery}>
      <div className={s.mainImage}>
        <If condition={!!images[selectedImage] && !mainImgError}>
          <Then>
            <When condition={!mainImgLoaded}>
              <div className={s.skeleton} />
            </When>
            <Image
              src={images[selectedImage]}
              alt={name}
              fill
              className={s.image}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized={unoptimized}
              onLoad={handleMainImgLoad}
              onError={handleMainImgError}
            />
          </Then>
          <Else>
            <div className={s.placeholder}>
              <ImageOff className={s.placeholderIcon} />
            </div>
          </Else>
        </If>
      </div>

      <When condition={images.length > 1}>
        <div className={s.thumbnails}>
          {images.map((img, index) => (
            <GalleryThumb
              key={index}
              src={img}
              alt={`${name} ${index + 1}`}
              isActive={index === selectedImage}
              onClick={handleSelectImage(index)}
              unoptimized={unoptimized}
            />
          ))}
        </div>
      </When>
    </div>
  );
};
