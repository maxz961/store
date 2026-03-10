import type { SelectOption } from '@/components/ui/SelectField.types';


export interface CategoryTagsSectionProps {
  categoryOptions: SelectOption[];
  tags: { id: string; name: string }[];
  selectedTags: string[];
  onToggleTag: (id: string) => () => void;
}

export interface TagToggleButtonProps {
  tag: { id: string; name: string };
  isActive: boolean;
  onClick: () => void;
}
