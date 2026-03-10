import { Badge } from '@/components/ui/badge';
import { s } from './ProductFilters.styled';
import type { TagButtonProps } from './ProductFilters.types';


export const TagButton = ({ tag, isActive, onClick }: TagButtonProps) => (
  <button onClick={onClick}>
    <Badge
      variant={isActive ? 'default' : 'outline'}
      className={s.tagBadge}
    >
      {tag.name}
    </Badge>
  </button>
);
