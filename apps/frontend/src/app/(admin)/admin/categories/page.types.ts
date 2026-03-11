import type { Category } from '@/lib/hooks/useProducts';


export interface CategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}
