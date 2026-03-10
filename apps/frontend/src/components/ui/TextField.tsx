import { forwardRef } from 'react';
import { When } from 'react-if';
import { cn } from '@/lib/utils';
import type { TextFieldProps } from './TextField.types';
import { s } from './TextField.styled';

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
  error,
  required,
  disabled,
  maxLength,
  min,
  step,
  className,
  inputClassName,
  ...rest
}, ref) => {
  return (
    <div className={cn(s.wrapper, className)}>
      <label className={s.label}>{label}</label>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        min={min}
        step={step}
        className={cn(s.input, error && s.inputError, inputClassName)}
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

TextField.displayName = 'TextField';
