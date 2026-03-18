import type { Tag } from '@/lib/hooks/useProducts';


export interface TagRowProps {
  tag: Tag;
  canDelete: boolean;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}
