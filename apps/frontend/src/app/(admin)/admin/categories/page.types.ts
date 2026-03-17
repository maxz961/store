import type { Category } from '@/lib/hooks/useProducts';


export interface CategoryRowProps {
  category: Category;
  canDelete: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}
