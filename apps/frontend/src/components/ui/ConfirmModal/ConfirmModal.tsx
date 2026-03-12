'use client';

import { useCallback } from 'react';
import { If, Then, Else, When } from 'react-if';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import type { ConfirmModalProps } from './ConfirmModal.types';
import { s } from './ConfirmModal.styled';


export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Удалить',
  isLoading = false,
}: ConfirmModalProps) => {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <When condition={open}>
      <div className={s.backdrop} onClick={handleBackdropClick} data-testid="confirm-modal-backdrop">
        <div className={s.card} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
          <div className={s.header}>
            <div className={s.iconWrapper}>
              <AlertTriangle className={s.icon} />
            </div>
            <div className={s.titleBlock}>
              <p id="confirm-modal-title" className={s.title}>{title}</p>
              <p className={s.description}>{description}</p>
            </div>
          </div>

          <div className={s.actions}>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
              <If condition={isLoading}>
                <Then><Spinner size="sm" /></Then>
                <Else>{confirmLabel}</Else>
              </If>
            </Button>
          </div>
        </div>
      </div>
    </When>
  );
};
