import { cn } from '@/lib/utils';
import { s } from './page.styled';
import type { StatusButtonProps } from './page.types';

export const StatusButton = ({ label, isActive, disabled, onClick }: StatusButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      s.statusBtn,
      isActive ? s.statusBtnActive : s.statusBtnInactive,
      'disabled:opacity-50 disabled:cursor-not-allowed',
    )}
  >
    {label}
  </button>
);
