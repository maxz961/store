import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { GalleryThumb } from './GalleryThumb';
import { s } from './page.styled';
import type { ProductGalleryProps } from './page.types';


export const ProductGallery = ({
  images,
  name,
  selectedImage,
  mainImgLoaded,
  mainImgError,
  onSelectImage,
  onMainImgLoad,
  onMainImgError,
}: ProductGalleryProps) => {
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
              onLoad={onMainImgLoad}
              onError={onMainImgError}
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
              onClick={onSelectImage(index)}
            />
          ))}
        </div>
      </When>
    </div>
  );
};
