export interface StarIconProps {
  star: number;
  isFilled: boolean;
  isHovering: boolean;
  isInteractive: boolean;
  size: 'sm' | 'md' | 'lg';
  onMouseEnter?: () => void;
  onClick?: () => void;
}
