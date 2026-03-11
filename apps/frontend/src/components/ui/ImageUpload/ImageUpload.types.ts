export interface ImageUploadProps {
  files: File[];
  existingUrls?: string[];
  onChange: (files: File[]) => void;
  onRemoveExisting?: (url: string) => void;
  maxFiles?: number;
}
