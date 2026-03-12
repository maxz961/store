import { s, statusDotColors } from './page.styled';
import { STATUS_LABELS } from '@/lib/constants/order';
import type { StatusRowProps } from './page.types';


export const StatusRow = ({ status, count }: StatusRowProps) => (
  <div className={s.statusRow}>
    <div className={s.statusInfo}>
      <span className={`${s.statusDot} ${statusDotColors[status] ?? 'bg-muted'}`} />
      <span className={s.statusLabel}>{STATUS_LABELS[status] ?? status}</span>
    </div>
    <span className={s.statusCount}>{count}</span>
  </div>
);
