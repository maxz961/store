import { cn } from '@/lib/utils';
import type { Props } from './StatusBadge.types';
import { s, statusStyles, statusLabels } from './StatusBadge.styled';

export const StatusBadge = ({ status, className }: Props) => {
  return (
    <span className={cn(s.badge, statusStyles[status] ?? '', className)}>
      {statusLabels[status] ?? status}
    </span>
  );
};
