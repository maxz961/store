import { forwardRef } from 'react';
import { When } from 'react-if';
import { cn } from '@/lib/utils';
import { FieldTooltip } from '@/components/ui/FieldTooltip';
import type { CheckboxFieldProps } from './CheckboxField.types';
import { s } from './CheckboxField.styled';


export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(({
  label,
  checked,
  onChange,
  tooltip,
  error,
  className,
  ...rest
}, ref) => {
  return (
    <div className={s.wrapper}>
      <label className={cn(s.label, className)}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={s.checkbox}
          {...rest}
        />
        <span className={s.labelText}>
          {label}
          <When condition={!!tooltip}>
            <FieldTooltip text={tooltip!} />
          </When>
        </span>
      </label>
      <When condition={!!error}>
        <p className={s.error}>{error}</p>
      </When>
    </div>
  );
});

CheckboxField.displayName = 'CheckboxField';
