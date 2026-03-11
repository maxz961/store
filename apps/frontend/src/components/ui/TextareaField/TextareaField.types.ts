export interface TextareaFieldProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}
