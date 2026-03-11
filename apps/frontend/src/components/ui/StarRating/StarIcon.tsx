import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SIZES } from './StarRating.constants';
import { s } from './StarRating.styled';
import type { StarIconProps } from './StarIcon.types';


export const StarIcon = ({
  isFilled,
  isHovering,
  isInteractive,
  size,
  onMouseEnter,
  onClick,
}: StarIconProps) => (
  <Star
    className={cn(
      s.star,
      SIZES[size],
      isInteractive && s.starInteractive,
      isFilled
        ? (isHovering ? s.starHover : s.starFilled)
        : s.starEmpty,
    )}
    onMouseEnter={onMouseEnter}
    onClick={onClick}
  />
);
