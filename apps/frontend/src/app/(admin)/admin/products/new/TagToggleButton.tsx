import { cn } from '@/lib/utils';
import { s } from './page.styled';
import type { TagToggleButtonProps } from './page.types';


export const TagToggleButton = ({ tag, label, isActive, onClick }: TagToggleButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(s.tagBtn, isActive ? s.tagBtnActive : s.tagBtnInactive)}
  >
    {label}
  </button>
);
