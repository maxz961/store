import { cn } from '@/lib/utils';
import { s } from './ProductFilters.styled';
import type { CategoryButtonProps } from './ProductFilters.types';

export const CategoryButton = ({ category, isActive, onClick }: CategoryButtonProps) => (
  <button
    onClick={onClick}
    className={cn(s.categoryItem, isActive ? s.categoryActive : s.categoryInactive)}
  >
    {category.name}
  </button>
);
