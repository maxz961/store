import type { ReactNode } from 'react';

export interface Props {
  trigger: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}
