export interface ProductsSectionProps {
  products: { id: string; name: string }[];
  selectedIds: string[];
  onToggle: (id: string) => () => void;
}
