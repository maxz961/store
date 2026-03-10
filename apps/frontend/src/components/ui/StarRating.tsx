'use client';

import { useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { s } from './StarRating.styled';

const SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating = ({ value, onChange, size = 'md' }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState(0);
  const isInteractive = !!onChange;

  const handleMouseEnter = useCallback((star: number) => () => {
    if (isInteractive) setHoverValue(star);
  }, [isInteractive]);

  const handleMouseLeave = useCallback(() => setHoverValue(0), []);

  const handleClick = useCallback((star: number) => () => {
    onChange?.(star);
  }, [onChange]);

  const displayValue = hoverValue || value;

  return (
    <div
      className={s.container}
      onMouseLeave={isInteractive ? handleMouseLeave : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.round(displayValue);
        const isHovering = isInteractive && hoverValue > 0;

        return (
          <Star
            key={star}
            className={cn(
              s.star,
              SIZES[size],
              isInteractive && s.starInteractive,
              isFilled
                ? (isHovering ? s.starHover : s.starFilled)
                : s.starEmpty,
            )}
            onMouseEnter={isInteractive ? handleMouseEnter(star) : undefined}
            onClick={isInteractive ? handleClick(star) : undefined}
          />
        );
      })}
    </div>
  );
};
