import Image from 'next/image';
import { X } from 'lucide-react';
import { s } from './ImageUpload.styled';
import type { ImageThumbProps } from './ImageThumb.types';


export const ImageThumb = ({ src, onRemove }: ImageThumbProps) => (
  <div className={s.thumb}>
    <Image src={src} alt="" width={80} height={80} className={s.thumbImage} unoptimized loading="eager" />
    <button className={s.thumbRemove} onClick={onRemove} type="button">
      <X className="h-3 w-3" />
    </button>
  </div>
);
