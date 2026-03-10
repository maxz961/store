import type { ReactNode } from 'react';

export interface Props {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
}
