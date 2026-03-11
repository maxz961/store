'use client';

import { useState, useCallback } from 'react';
import { StarIcon } from './StarIcon';
import type { StarRatingProps } from './StarRating.types';
import { s } from './StarRating.styled';


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
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          isFilled={star <= Math.round(displayValue)}
          isHovering={isInteractive && hoverValue > 0}
          isInteractive={isInteractive}
          size={size}
          onMouseEnter={isInteractive ? handleMouseEnter(star) : undefined}
          onClick={isInteractive ? handleClick(star) : undefined}
        />
      ))}
    </div>
  );
};
