export interface StarIconProps {
  isFilled: boolean;
  isHovering: boolean;
  isInteractive: boolean;
  size: 'sm' | 'md' | 'lg';
  onMouseEnter?: () => void;
  onClick?: () => void;
}
