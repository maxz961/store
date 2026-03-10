import { cn } from '@/lib/utils';
import { s, statusStyles, statusLabels } from './StatusBadge.styled';


interface Props {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: Props) => {
  return (
    <span className={cn(s.badge, statusStyles[status] ?? '', className)}>
      {statusLabels[status] ?? status}
    </span>
  );
};
