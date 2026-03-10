export interface TextFieldProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number' | 'email' | 'tel' | 'url';
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  min?: string | number;
  step?: string;
  className?: string;
  inputClassName?: string;
}
