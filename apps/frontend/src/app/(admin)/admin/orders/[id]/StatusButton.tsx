import { If, Then, Else } from 'react-if';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { s } from './page.styled';
import type { StatusButtonProps } from './page.types';


export const StatusButton = ({ label, isActive, isLoading, disabled, onClick }: StatusButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      s.statusBtn,
      isActive ? s.statusBtnActive : s.statusBtnInactive,
      'disabled:opacity-50 disabled:cursor-not-allowed',
    )}
  >
    <If condition={isLoading}>
      <Then><Spinner size="sm" /></Then>
      <Else>{label}</Else>
    </If>
  </button>
);
