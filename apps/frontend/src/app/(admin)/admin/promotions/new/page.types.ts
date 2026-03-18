export interface ProductsSectionProps {
  products: { id: string; name: string; nameEn?: string | null }[];
  selectedIds: string[];
  onToggle: (id: string) => () => void;
}
