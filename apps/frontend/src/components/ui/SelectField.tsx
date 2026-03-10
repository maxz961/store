import { forwardRef } from 'react';
import { When } from 'react-if';
import { cn } from '@/lib/utils';
import type { SelectFieldProps } from './SelectField.types';
import { s } from './SelectField.styled';

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  className,
  ...rest
}, ref) => {
  return (
    <div className={cn(s.wrapper, className)}>
      <label className={s.label}>{label}</label>
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        required={required}
        className={cn(s.select, error && s.selectError)}
        {...rest}
      >
        <When condition={!!placeholder}>
          <option value="">{placeholder}</option>
        </When>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <When condition={!!error}>
        <p className={s.error}>{error}</p>
      </When>
    </div>
  );
});

SelectField.displayName = 'SelectField';
