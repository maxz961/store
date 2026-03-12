export interface GalleryThumbProps {
  src: string;
  alt: string;
  isActive: boolean;
  onClick: () => void;
  unoptimized?: boolean;
}
