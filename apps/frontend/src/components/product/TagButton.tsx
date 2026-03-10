import { Badge } from '@/components/ui/badge';
import type { TagButtonProps } from './ProductFilters.types';

export const TagButton = ({ tag, isActive, onClick }: TagButtonProps) => (
  <button onClick={onClick}>
    <Badge
      variant={isActive ? 'default' : 'outline'}
      className="cursor-pointer transition-opacity duration-150 hover:opacity-80"
    >
      {tag.name}
    </Badge>
  </button>
);
