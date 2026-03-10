import Image from 'next/image';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import type { GalleryThumbProps } from './GalleryThumb.types';


export const GalleryThumb = ({ src, alt, isActive, onClick }: GalleryThumbProps) => (
  <button
    onClick={onClick}
    className={cn(s.thumb, isActive ? s.thumbActive : s.thumbInactive)}
  >
    <Image src={src} alt={alt} fill className={s.thumbImage} sizes="64px" />
  </button>
);
