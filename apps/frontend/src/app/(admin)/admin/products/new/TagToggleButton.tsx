import { cn } from '@/lib/utils';
import { s } from './page.styled';
import type { TagToggleButtonProps } from './page.types';

export const TagToggleButton = ({ tag, isActive, onClick }: TagToggleButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(s.tagBtn, isActive ? s.tagBtnActive : s.tagBtnInactive)}
  >
    {tag.name}
  </button>
);
