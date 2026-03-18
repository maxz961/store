export interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  _count?: { products: number };
}

export interface Tag {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  _count?: { products: number };
}

export interface Props {
  categories: Category[];
  tags: Tag[];
  currentCategory?: string;
  currentTags: string[];
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentSort?: string;
}

export interface CategoryButtonProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

export interface TagButtonProps {
  tag: Tag;
  isActive: boolean;
  onClick: () => void;
}
