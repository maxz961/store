'use client';

import { forwardRef, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { If, Then, Else, When } from 'react-if';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FieldTooltip } from '@/components/ui/FieldTooltip';
import type { SelectFieldProps } from './SelectField.types';
import { s } from './SelectField.styled';


export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(({
  label,
  value,
  onChange,
  options,
  placeholder,
  tooltip,
  error,
  required,
  className,
  ...rest
}, ref) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allOptions = useMemo(
    () => (placeholder ? [{ value: '', label: placeholder }, ...options] : options),
    [options, placeholder],
  );

  const selectedLabel = useMemo(
    () => allOptions.find((o) => o.value === (value ?? ''))?.label ?? placeholder ?? '',
    [allOptions, value, placeholder],
  );

  const handleToggle = useCallback(() => setOpen((prev) => !prev), []);

  const handleSelectOption = useCallback(
    (optValue: string) => () => {
      onChange?.({ target: { value: optValue } } as React.ChangeEvent<HTMLSelectElement>);
      setOpen(false);
    },
    [onChange],
  );

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div className={cn(s.wrapper, className)}>
      {/* Hidden native select for React Hook Form (ref, name, onChange, onBlur) */}
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        required={required}
        aria-hidden="true"
        tabIndex={-1}
        className={s.hiddenSelect}
        {...rest}
      >
        <When condition={!!placeholder}>
          <option value="">{placeholder}</option>
        </When>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <When condition={!!label}>
        <label className={s.label}>
          {label}
          <When condition={!!tooltip}>
            <FieldTooltip text={tooltip!} />
          </When>
        </label>
      </When>

      <div className={s.dropdownWrapper} ref={dropdownRef}>
        <button
          type="button"
          onClick={handleToggle}
          aria-label={label || undefined}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(s.trigger, error && s.triggerError, open && s.triggerOpen)}
        >
          <If condition={!!value}>
            <Then><span>{selectedLabel}</span></Then>
            <Else><span className={s.triggerPlaceholder}>{placeholder}</span></Else>
          </If>
          <ChevronDown className={cn(s.chevron, open && s.chevronOpen)} />
        </button>

        <When condition={open}>
          <ul className={s.panel} role="listbox">
            {allOptions.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === (value ?? '')}
                className={cn(s.option, opt.value === (value ?? '') && s.optionActive)}
                onClick={handleSelectOption(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </When>
      </div>

      <When condition={!!error}>
        <p className={s.error}>{error}</p>
      </When>
    </div>
  );
});

SelectField.displayName = 'SelectField';
