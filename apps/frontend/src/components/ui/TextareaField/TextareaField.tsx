import { forwardRef } from 'react';
import { When } from 'react-if';
import { cn } from '@/lib/utils';
import { FieldTooltip } from '@/components/ui/FieldTooltip';
import type { TextareaFieldProps } from './TextareaField.types';
import { s } from './TextareaField.styled';


export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(({
  label,
  value,
  onChange,
  placeholder,
  hint,
  tooltip,
  error,
  required,
  rows = 4,
  maxLength,
  className,
  ...rest
}, ref) => {
  return (
    <div className={cn(s.wrapper, className)}>
      <label className={s.label}>
        {label}
        <When condition={!!tooltip}>
          <FieldTooltip text={tooltip!} />
        </When>
      </label>
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={cn(s.textarea, error && s.textareaError)}
        {...rest}
      />
      <When condition={!!error}>
        <p className={s.error}>{error}</p>
      </When>
      <When condition={!!hint && !error}>
        <p className={s.hint}>{hint}</p>
      </When>
    </div>
  );
});

TextareaField.displayName = 'TextareaField';
