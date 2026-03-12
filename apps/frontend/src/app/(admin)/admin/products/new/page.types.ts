import type { SelectOption } from '@/components/ui/SelectField';


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

export interface ImagesSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export interface ProductPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
}
