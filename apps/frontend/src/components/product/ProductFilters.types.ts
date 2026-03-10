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
