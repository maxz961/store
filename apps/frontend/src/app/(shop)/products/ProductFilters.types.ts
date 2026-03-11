export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Props {
  categories: Category[];
  tags: Tag[];
  currentCategory?: string;
  currentTags: string[];
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
