export interface CheckboxFieldProps {
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tooltip?: string;
  error?: string;
  className?: string;
}
