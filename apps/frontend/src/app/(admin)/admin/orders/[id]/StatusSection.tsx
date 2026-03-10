import { s } from './page.styled';
import { StatusButton } from './StatusButton';
import { STATUSES, STATUS_LABELS } from '@/lib/constants/order';
import type { StatusSectionProps } from './page.types';

export const StatusSection = ({ orderStatus, onUpdateStatus, isPending }: StatusSectionProps) => (
  <div className={s.statusCard}>
    <p className={s.statusTitle}>Статус заказа</p>
    <div className={s.statusButtons}>
      {STATUSES.map((status) => (
        <StatusButton
          key={status}
          status={status}
          label={STATUS_LABELS[status]}
          isActive={orderStatus === status}
          disabled={isPending || orderStatus === status}
          onClick={onUpdateStatus(status)}
        />
      ))}
    </div>
  </div>
);
