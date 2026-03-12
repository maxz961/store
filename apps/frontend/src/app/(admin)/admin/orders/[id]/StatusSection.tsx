'use client';

import { useState, useCallback } from 'react';
import { s } from './page.styled';
import { StatusButton } from './StatusButton';
import { STATUSES, STATUS_LABELS } from '@/lib/constants/order';
import type { StatusSectionProps } from './page.types';


export const StatusSection = ({ orderStatus, onUpdateStatus, isPending }: StatusSectionProps) => {
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const handleClick = useCallback((status: string) => () => {
    setPendingStatus(status);
    onUpdateStatus(status)();
  }, [onUpdateStatus]);

  return (
    <div className={s.statusCard}>
      <p className={s.statusTitle}>Статус заказа</p>
      <div className={s.statusButtons}>
        {STATUSES.map((status) => (
          <StatusButton
            key={status}
            status={status}
            label={STATUS_LABELS[status]}
            isActive={orderStatus === status}
            isLoading={isPending && pendingStatus === status}
            disabled={isPending || orderStatus === status}
            onClick={handleClick(status)}
          />
        ))}
      </div>
    </div>
  );
};
