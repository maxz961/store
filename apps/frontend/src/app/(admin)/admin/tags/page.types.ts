import type { Tag } from '@/lib/hooks/useProducts';


export interface TagRowProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}
